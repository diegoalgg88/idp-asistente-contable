"""
Bank Statement Parser
Parser de estados de cuenta bancarios (Múltiples bancos de México)

Soporta:
- BBVA México
- Santander México
- Banorte
- Citibanamex
- Scotiabank
- HSBC
- Inbursa
- Banregio
- Afirme
- Banco del Bajío
- BanCoppel
- Azteca
- BanCrédito
- Multiva
- Genérico (cualquier otro banco)
"""

import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from decimal import Decimal
import chardet
import re
import logging

from app.db.models_reconciliation import BankTransaction

logger = logging.getLogger(__name__)


class BankStatementParser:
    """
    Parser de estados de cuenta bancarios
    
    Soporta 15+ bancos mexicanos mediante:
    1. Detección automática por patrones
    2. Mapeo de columnas inteligente
    3. Fallback a parser genérico
    """
    
    # Bancos soportados con patrones de detección
    SUPPORTED_BANKS = {
        'bbva': ['bbva', 'bbva méxico', 'bbva bancomer'],
        'santander': ['santander', 'banco santander'],
        'banorte': ['banorte', 'banco banorte', 'gbm banorte'],
        'citibanamex': ['citibanamex', 'banamex', 'citi banamex'],
        'scotiabank': ['scotiabank', 'scotia'],
        'hsbc': ['hsbc', 'hsbc méxico'],
        'inbursa': ['inbursa', 'banco inbursa'],
        'banregio': ['banregio', 'banco banregio'],
        'afirme': ['afirme', 'banco afirme'],
        'bajio': ['bajío', 'banco del bajío', 'banbajío'],
        'bancoppel': ['bancoppel', 'banco coppel'],
        'azteca': ['azteca', 'banco azteca'],
        'bancredito': ['bancrédito', 'banco bcrédito'],
        'multiva': ['multiva', 'banco multiva'],
        'nu': ['nu méxico', 'nu bank', 'nu'],
        'heybanco': ['hey banco', 'heybanco', 'hey']
    }
    
    # Columnas requeridas (mínimas)
    MINIMUM_REQUIRED_COLUMNS = ['fecha', 'concepto', 'monto']
    
    # Columnas opcionales recomendadas (Condusef)
    RECOMMENDED_COLUMNS = ['fecha_valor', 'referencia', 'proveedor', 'saldo']
    
    # Mapeo de columnas a formato estándar
    # Permite variaciones en nombres de columnas
    COLUMN_MAPPING = {
        'fecha': [
            'fecha', 'date', 'fecha_operacion', 'fecha_valor',
            'fecha_aplicacion', 'transaction_date', 'value_date'
        ],
        'fecha_valor': [
            'fecha_valor', 'value_date', 'fecha_aplicacion', 'fecha_operacion'
        ],
        'concepto': [
            'concepto', 'descripcion', 'descripcion_movimiento', 'detalle',
            'descripcion_concepto', 'concepto_movimiento', 'narrative',
            'referencia', 'ref', 'memo'
        ],
        'cargo': [
            'cargo', 'retiros', 'debito', 'egreso', 'pago',
            'withdrawal', 'debit', 'charge', 'outflow'
        ],
        'abono': [
            'abono', 'depositos', 'credito', 'ingreso', 'pago_recibido',
            'deposit', 'credit', 'income', 'inflow'
        ],
        'saldo': [
            'saldo', 'saldo_despues', 'balance', 'saldo_final',
            'running_balance', 'account_balance'
        ],
        'referencia': [
            'referencia', 'ref', 'folio', 'numero_operacion',
            'transaction_id', 'operation_number'
        ],
        'proveedor': [
            'proveedor', 'beneficiario', 'contraparte', 'merchant',
            'counterparty', 'payee'
        ]
    }
    
    # Stopwords para limpieza de concepto
    STOPWORDS = [
        'pago', 'servicio', 'serv', 'sa', 'sc', 'rl', 'cv',
        'mex', 'mexico', 'de', 'del', 'la', 'el', 'los', 'las',
        'un', 'una', 'unos', 'unas', 'por', 'en', 'con', 'sin'
    ]
    
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
    
    def detect_bank_format(self, ruta_archivo: str) -> Tuple[str, str]:
        """
        Detecta el banco por formato de columnas y patrones
        
        Args:
            ruta_archivo: Ruta al archivo
            
        Returns:
            Tuple[str, str]: (banco_detectado, nombre_completo)
        """
        try:
            # Detectar encoding
            with open(ruta_archivo, 'rb') as f:
                result = chardet.detect(f.read(10000))
                encoding = result['encoding'] or 'utf-8'
            
            # Leer primeras líneas para detectar patrones
            with open(ruta_archivo, 'r', encoding=encoding) as f:
                lines = list(f.readlines())[:10]
            
            # Unir líneas y buscar patrones (case-insensitive)
            content = ''.join(lines).lower()
            
            # Buscar patrones de cada banco
            for bank_code, patterns in self.SUPPORTED_BANKS.items():
                if any(pattern in content for pattern in patterns):
                    # Obtener nombre completo del banco
                    bank_name = patterns[0].title()
                    return bank_code, bank_name
            
            # Si no hay patrón claro, intentar detectar por columnas
            df = pd.read_csv(ruta_archivo, encoding=encoding, nrows=1)
            columns = [col.lower().strip() for col in df.columns]
            
            # Verificar columnas mínimas requeridas
            mapped = self._map_columns(columns)
            has_minimum = all(col in mapped for col in self.MINIMUM_REQUIRED_COLUMNS)
            
            if has_minimum:
                # Intentar inferir banco por columnas específicas
                if 'saldo' in mapped or 'balance' in columns:
                    # Bancos tradicionales suelen incluir saldo
                    return 'generic', 'Banco (Formato Estándar)'
                else:
                    return 'generic', 'Banco (Formato Simplificado)'
            
            # No se pudo detectar
            self.warnings.append("No se pudo detectar el banco automáticamente")
            return 'generic', 'Banco (Genérico)'
            
        except Exception as e:
            self.errors.append(f"Error detectando formato: {str(e)}")
            return 'generic', 'Banco (No Detectado)'
    
    def _map_columns(self, columns: List[str]) -> Dict[str, str]:
        """
        Mapea columnas a formato estándar
        
        Args:
            columns: Lista de nombres de columnas
            
        Returns:
            Dict: Mapeo de columna estándar a columna original
        """
        mapping = {}
        
        for standard, variants in self.COLUMN_MAPPING.items():
            for col in columns:
                if col in variants or any(v in col for v in variants):
                    mapping[standard] = col
                    break
        
        return mapping
    
    def parse(
        self,
        ruta_archivo: str,
        banco: Optional[str] = None
    ) -> Tuple[List[BankTransaction], str, str]:
        """
        Parsea estado de cuenta y retorna lista de transacciones
        
        Args:
            ruta_archivo: Ruta al archivo
            banco: Nombre del banco (opcional, se detecta automáticamente si no se proporciona)
            
        Returns:
            Tuple: (transactions, banco_code, banco_nombre)
        """
        # Detectar banco si no se proporciona
        if banco is None:
            banco_code, banco_nombre = self.detect_bank_format(ruta_archivo)
        else:
            banco_code = banco.lower().replace(' ', '_').replace('á', 'a')
            banco_nombre = banco.title()
        
        logger.info(f"Parseando estado de cuenta: {banco_nombre}")
        
        # Detectar encoding
        with open(ruta_archivo, 'rb') as f:
            result = chardet.detect(f.read(10000))
            encoding = result['encoding'] or 'utf-8'
        
        # Encodings comunes en bancos mexicanos (prioridad)
        common_encodings = ['utf-8', 'windows-1252', 'latin-1', 'iso-8859-1']
        if encoding not in common_encodings:
            # Intentar con encodings comunes si el detectado no es estándar
            for enc in common_encodings:
                try:
                    with open(ruta_archivo, 'r', encoding=enc) as f:
                        f.read(1000)
                    encoding = enc
                    break
                except Exception:
                    continue
        
        # Leer archivo según extensión
        file_ext = Path(ruta_archivo).suffix.lower()
        
        if file_ext in ['.csv']:
            df = pd.read_csv(ruta_archivo, encoding=encoding)
        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(ruta_archivo)
        else:
            raise ValueError(f"Formato no soportado: {file_ext}. Use .csv, .xlsx o .xls")
        
        # Mapear columnas
        columns = [col.lower().strip() for col in df.columns]
        column_map = self._map_columns(columns)
        
        # Validar columnas requeridas
        missing = [col for col in self.MINIMUM_REQUIRED_COLUMNS if col not in column_map]
        
        if missing:
            raise ValueError(
                f"Columnas requeridas faltantes: {missing}. "
                f"Columnas encontradas: {list(df.columns)}"
            )
        
        # Parsear transacciones
        transactions = []
        
        for idx, row in df.iterrows():
            try:
                tx = self._parse_row(row, column_map)
                if tx:
                    transactions.append(tx)
            except Exception as e:
                self.warnings.append(f"Fila {idx + 2}: {str(e)}")
                continue
        
        logger.info(f"Se parsearon {len(transactions)} transacciones de {banco_nombre}")
        
        return transactions, banco_code, banco_nombre
    
    def _parse_row(self, row: pd.Series, column_map: Dict[str, str]) -> Optional[BankTransaction]:
        """
        Parsea una fila individual
        
        Args:
            row: Fila del DataFrame
            column_map: Mapeo de columnas
            
        Returns:
            Optional[BankTransaction]: Transacción o None si hay error
        """
        # Extraer fecha
        fecha_raw = row[column_map['fecha']]
        fecha = self._parse_date(fecha_raw)
        
        # Extraer fecha de valor (opcional, según Condusef)
        fecha_valor = None
        if 'fecha_valor' in column_map:
            fecha_valor_raw = row[column_map['fecha_valor']]
            try:
                fecha_valor = self._parse_date(fecha_valor_raw)
            except Exception:
                fecha_valor = fecha  # Fallback a fecha normal
        
        # Extraer concepto
        concepto = str(row[column_map['concepto']])
        
        # Extraer monto
        monto, tipo = self._parse_amount_row(row, column_map)
        
        # Extraer saldo (opcional)
        saldo = None
        if 'saldo' in column_map:
            saldo = self._parse_amount(row[column_map['saldo']])
        
        # Extraer referencia (opcional, según Condusef)
        referencia = None
        if 'referencia' in column_map:
            referencia = str(row[column_map['referencia']])
        
        # Extraer proveedor (opcional)
        proveedor = None
        if 'proveedor' in column_map:
            proveedor = str(row[column_map['proveedor']])
        
        # Limpiar concepto
        concepto_limpio = self._normalize_text(concepto)
        
        # Crear transacción
        return BankTransaction(
            fecha=fecha,
            fecha_valor=fecha_valor,
            concepto=concepto,
            concepto_limpio=concepto_limpio,
            tipo=tipo,
            monto=abs(monto),
            saldo=saldo,
            referencia=referencia,
            proveedor=proveedor,
            match_status='unmatched'
        )
    
    def _parse_amount_row(
        self,
        row: pd.Series,
        column_map: Dict[str, str]
    ) -> Tuple[Decimal, str]:
        """
        Parsea monto de una fila
        
        Args:
            row: Fila del DataFrame
            column_map: Mapeo de columnas
            
        Returns:
            Tuple[Decimal, str]: (monto, tipo)
        """
        # Si hay columnas separadas para cargo/abono
        if 'cargo' in column_map and 'abono' in column_map:
            cargo = self._parse_amount(row[column_map['cargo']])
            abono = self._parse_amount(row[column_map['abono']])
            
            if cargo and cargo > 0:
                return cargo, 'cargo'
            elif abono and abono > 0:
                return abono, 'abono'
            else:
                return Decimal('0'), 'cargo'
        
        # Si hay una sola columna de monto
        elif 'monto' in column_map:
            monto = self._parse_amount(row[column_map['monto']])
            tipo = 'cargo' if monto < 0 else 'abono'
            return abs(monto), tipo
        
        # Fallback: intentar con cualquier columna numérica
        else:
            for col in row.index:
                col_lower = col.lower().strip()
                if any(x in col_lower for x in ['cargo', 'retiro', 'debit', 'abono', 'deposit', 'credit']):
                    amount = self._parse_amount(row[col])
                    if amount and amount != 0:
                        tipo = 'cargo' if 'cargo' in col_lower or 'retiro' in col_lower or 'debit' in col_lower else 'abono'
                        return abs(amount), tipo
        
        return Decimal('0'), 'cargo'
    
    def _parse_date(self, date_value: Any) -> datetime:
        """
        Parsea valor a datetime
        
        Args:
            date_value: Valor de fecha (string, datetime, etc.)
            
        Returns:
            datetime: Fecha parseada
        """
        if isinstance(date_value, datetime):
            return date_value
        
        if isinstance(date_value, str):
            # Intentar múltiples formatos
            formats = [
                '%Y-%m-%d',
                '%d/%m/%Y',
                '%m/%d/%Y',
                '%Y/%m/%d',
                '%d-%m-%Y',
                '%m-%d-%Y'
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_value.strip(), fmt)
                except ValueError:
                    continue
            
            raise ValueError(f"No se pudo parsear fecha: {date_value}")
        
        raise ValueError(f"Tipo de fecha no soportado: {type(date_value)}")
    
    def _parse_amount(self, amount_value: Any) -> Decimal:
        """
        Parsea valor a Decimal
        
        Args:
            amount_value: Valor de monto (string, float, int, etc.)
            
        Returns:
            Decimal: Monto parseado
        """
        if isinstance(amount_value, (int, float)):
            return Decimal(str(amount_value))
        
        if isinstance(amount_value, Decimal):
            return amount_value
        
        if isinstance(amount_value, str):
            # Limpiar string
            cleaned = amount_value.strip()
            
            # Remover símbolos de moneda
            cleaned = cleaned.replace('$', '').replace('MXN', '').strip()
            
            # Manejar paréntesis (negativos)
            if cleaned.startswith('(') and cleaned.endswith(')'):
                cleaned = '-' + str(cleaned)[1:-1]
            
            # Remover comas de miles
            cleaned = cleaned.replace(',', '')
            
            # Convertir a Decimal
            try:
                return Decimal(cleaned)
            except Exception:
                return Decimal('0')
        
        return Decimal('0')
    
    def _normalize_text(self, text: str) -> str:
        """
        Normaliza texto para comparación
        
        Args:
            text: Texto a normalizar
            
        Returns:
            str: Texto normalizado
        """
        import unicodedata
        
        # Minúsculas
        text = text.lower()
        
        # Eliminar acentos
        text = unicodedata.normalize('NFD', text)
        text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
        
        # Eliminar caracteres especiales
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        
        # Eliminar stopwords comunes
        stopwords = [
            'pago', 'servicio', 'serv', 'sa', 'sc', 'rl', 'cv',
            'mex', 'mexico', 'de', 'del', 'la', 'el', 'los', 'las'
        ]
        text = ' '.join(word for word in text.split() if word not in stopwords)
        
        # Eliminar espacios múltiples
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def parse_bbva(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para BBVA México"""
        return self.parse(ruta_archivo, banco='bbva')
    
    def parse_santander(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Santander México"""
        return self.parse(ruta_archivo, banco='santander')
    
    def parse_banorte(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Banorte"""
        return self.parse(ruta_archivo, banco='banorte')
    
    def parse_citibanamex(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Citibanamex"""
        return self.parse(ruta_archivo, banco='citibanamex')
    
    def parse_scotiabank(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Scotiabank"""
        return self.parse(ruta_archivo, banco='scotiabank')
    
    def parse_hsbc(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para HSBC"""
        return self.parse(ruta_archivo, banco='hsbc')
    
    def parse_inbursa(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Inbursa"""
        return self.parse(ruta_archivo, banco='inbursa')
    
    def parse_banregio(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Banregio"""
        return self.parse(ruta_archivo, banco='banregio')
    
    def parse_afirme(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Afirme"""
        return self.parse(ruta_archivo, banco='afirme')
    
    def parse_bajio(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Banco del Bajío"""
        return self.parse(ruta_archivo, banco='bajio')
    
    def parse_bancoppel(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para BanCoppel"""
        return self.parse(ruta_archivo, banco='bancoppel')
    
    def parse_azteca(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Banco Azteca"""
        return self.parse(ruta_archivo, banco='azteca')
    
    def parse_bancredito(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para BanCrédito"""
        return self.parse(ruta_archivo, banco='bancredito')
    
    def parse_multiva(self, ruta_archivo: str) -> Tuple[List[BankTransaction], str, str]:
        """Parser específico para Multiva"""
        return self.parse(ruta_archivo, banco='multiva')
    
    def get_errors(self) -> List[str]:
        """Retorna lista de errores"""
        return self.errors
    
    def get_warnings(self) -> List[str]:
        """Retorna lista de warnings"""
        return self.warnings
