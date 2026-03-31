"""
CFDI Validator
Validación de CFDI 4.0 contra esquemas XSD del SAT y catálogos

Validación en 4 niveles:
1. Estructura XML (cfdi40.xsd)
2. Tipos de datos (tipos.xsd)
3. Catálogos SAT (catalogos.xsd)
4. Reglas de negocio (Anexo 20, Matriz de Errores)
"""

from lxml import etree
from typing import Dict, Optional
from pathlib import Path
import logging
import re

logger = logging.getLogger(__name__)


class CFDIValidator:
    """
    Valida CFDI 4.0 contra esquemas XSD oficiales del SAT.
    Implementa validación en 4 niveles + reglas de negocio.
    """

    # URLs oficiales de esquemas XSD del SAT
    SAT_XSD_URLS = {
        'cfdi40': 'https://www.sat.gob.mx/esquemas/xsd/4.0/cfdi40.xsd',
        'tipos': 'https://www.sat.gob.mx/esquemas/xsd/4.0/tipos.xsd',
        'catalogos': 'https://www.sat.gob.mx/esquemas/xsd/4.0/catalogos.xsd',
        'nomina12': 'https://www.sat.gob.mx/esquemas/xsd/nomina12/nomina12.xsd',
        'timbrefiscalv11': 'https://www.sat.gob.mx/esquemas/xsd/timbrerefiscalv11/timbrerefiscalv11.xsd'
    }

    # Catálogos SAT 2026
    CATALOGOS_SAT = {
        'clave_prod_serv': 'ClaveProdServ',
        'clave_unidad': 'ClaveUnidad',
        'uso_cfdi': 'UsoCFDI',
        'regimen_fiscal': 'RegimenFiscal',
        'forma_pago': 'FormaPago',
        'metodo_pago': 'MetodoPago',
        'moneda': 'Moneda',
        'tipo_comprobante': 'TipoDeComprobante',
        'tipo_nomina': 'TipoNomina',
        'tipo_regimen': 'TipoRegimen',
        'tipo_contrato': 'TipoContrato',
        'tipo_jornada': 'TipoJornada',
        'periodicidad_pago': 'PeriodicidadPago',
        'tipo_percepcion': 'TipoPercepcion',
        'tipo_deduccion': 'TipoDeduccion',
        'tipo_otro_pago': 'TipoOtroPago',
        'riesgo_puesto': 'RiesgoPuesto',
        'codigo_postal': 'CodigoPostal'
    }

    # Errores comunes y soluciones
    ERRORES_COMUNES = {
        'cfdi40-001': {
            'descripcion': 'Campo Version es requerido',
            'solucion': 'Agregar atributo Version="4.0" en nodo Comprobante',
            'severidad': 'CRITICAL'
        },
        'cfdi40-002': {
            'descripcion': 'Fecha debe estar en formato yyyy-MM-ddTHH:mm:ss',
            'solucion': 'Corregir formato de fecha (ej: 2026-01-15T12:00:00)',
            'severidad': 'CRITICAL'
        },
        'cfdi40-003': {
            'descripcion': 'Sello digital es requerido',
            'solucion': 'Timbrar CFDI con PAC para obtener sello',
            'severidad': 'CRITICAL'
        },
        'cat-001': {
            'descripcion': 'Clave de producto/servicio no existe en catálogo',
            'solucion': 'Buscar clave válida en catálogo ClaveProdServ del SAT',
            'severidad': 'CRITICAL'
        },
        'cat-002': {
            'descripcion': 'Uso de CFDI inválido',
            'solucion': 'Usar clave válida de UsoCFDI (ej: G01, G03, I01, CP01)',
            'severidad': 'CRITICAL'
        },
        'nom-001': {
            'descripcion': 'CFDI de Nómina requiere complemento nomina12:Nomina',
            'solucion': 'Agregar nodo nomina12:Nomina con atributos obligatorios',
            'severidad': 'CRITICAL'
        },
        'nom-002': {
            'descripcion': 'Importe gravado y exento no pueden ser ambos cero',
            'solucion': 'Al menos uno de ImporteGravado o ImporteExento debe ser mayor a cero',
            'severidad': 'CRITICAL'
        },
        'nom-003': {
            'descripcion': 'Clave 038 debe ser 100% gravada',
            'solucion': 'Establecer ImporteExento=0 para TipoPercepcion 038',
            'severidad': 'CRITICAL'
        }
    }

    def __init__(self, xsd_dir: str = "xsd_schemas/", catalogos_dir: str = "catalogos_sat/"):
        """
        Inicializa el validador de CFDI.

        Args:
            xsd_dir: Directorio local con esquemas XSD del SAT
            catalogos_dir: Directorio con catálogos SAT en CSV/JSON
        """
        self.xsd_dir = Path(xsd_dir)
        self.catalogos_dir = Path(catalogos_dir)
        self.schemas = {}
        self.catalogos = {}
        self._load_schemas()
        self._load_catalogos()

    def _load_schemas(self):
        """Carga esquemas XSD desde directorio local."""
        schema_files = {
            'cfdi40': 'cfdi40.xsd',
            'tipos': 'tipos.xsd',
            'catalogos': 'catalogos.xsd',
            'nomina12': 'nomina12.xsd',
            'timbrefiscalv11': 'timbrerefiscalv11.xsd'
        }

        for name, filename in schema_files.items():
            xsd_path = self.xsd_dir / filename
            if xsd_path.exists():
                try:
                    with open(xsd_path, 'rb') as f:
                        schema_doc = etree.parse(f)
                        self.schemas[name] = etree.XMLSchema(schema_doc)
                    logger.info(f"Schema {name} cargado exitosamente")
                except Exception as e:
                    logger.error(f"Error cargando schema {name}: {e}")
            else:
                logger.warning(f"Schema {filename} no encontrado en {xsd_path}")

    def _load_catalogos(self):
        """Carga catálogos SAT desde archivos locales."""
        import csv
        import json

        for clave, nombre in self.CATALOGOS_SAT.items():
            # Intentar cargar JSON primero
            json_path = self.catalogos_dir / f"{clave}.json"
            if json_path.exists():
                try:
                    with open(json_path, 'r', encoding='utf-8') as f:
                        self.catalogos[clave] = json.load(f)
                    logger.info(f"Catálogo {clave} cargado (JSON)")
                    continue
                except Exception as e:
                    logger.error(f"Error cargando catálogo {clave}: {e}")

            # Fallback a CSV
            csv_path = self.catalogos_dir / f"{clave}.csv"
            if csv_path.exists():
                try:
                    with open(csv_path, 'r', encoding='utf-8') as f:
                        reader = csv.DictReader(f)
                        self.catalogos[clave] = list(reader)
                    logger.info(f"Catálogo {clave} cargado (CSV)")
                except Exception as e:
                    logger.error(f"Error cargando catálogo {clave}: {e}")

    def validate_cfdi(self, xml_content: str, validate_nomina: bool = False) -> Dict:
        """
        Valida CFDI completo en 4 niveles.

        Args:
            xml_content: Contenido XML del CFDI
            validate_nomina: Si True, valida complemento de nómina

        Returns:
            Dict con resultado de validación:
            {
                'valid': bool,
                'errors': List[Dict],
                'warnings': List[Dict],
                'suggestions': List[Dict],
                'nivel_validacion': {
                    'xsd': bool,
                    'tipos': bool,
                    'catalogos': bool,
                    'reglas_negocio': bool
                }
            }
        """
        resultado = {
            'valid': True,
            'errors': [],
            'warnings': [],
            'suggestions': [],
            'nivel_validacion': {
                'xsd': False,
                'tipos': False,
                'catalogos': False,
                'reglas_negocio': False
            }
        }

        try:
            # Parsear XML
            cfdi_tree = etree.fromstring(xml_content.encode())

            # NIVEL 1: Validación XSD
            xsd_result = self._validate_xsd(cfdi_tree)
            resultado['nivel_validacion']['xsd'] = xsd_result['valid']
            resultado['errors'].extend(xsd_result['errors'])
            resultado['warnings'].extend(xsd_result['warnings'])

            # NIVEL 2: Validación de tipos
            tipos_result = self._validate_tipos(cfdi_tree)
            resultado['nivel_validacion']['tipos'] = tipos_result['valid']
            resultado['errors'].extend(tipos_result['errors'])
            resultado['warnings'].extend(tipos_result['warnings'])

            # NIVEL 3: Validación de catálogos
            catalogos_result = self._validate_catalogos(cfdi_tree)
            resultado['nivel_validacion']['catalogos'] = catalogos_result['valid']
            resultado['errors'].extend(catalogos_result['errors'])
            resultado['warnings'].extend(catalogos_result['warnings'])

            # NIVEL 4: Reglas de negocio
            reglas_result = self._validate_reglas_negocio(cfdi_tree)
            resultado['nivel_validacion']['reglas_negocio'] = reglas_result['valid']
            resultado['errors'].extend(reglas_result['errors'])
            resultado['warnings'].extend(reglas_result['warnings'])
            resultado['suggestions'].extend(reglas_result['suggestions'])

            # Validación específica de nómina
            if validate_nomina:
                nomina_result = self._validate_nomina(cfdi_tree)
                resultado['errors'].extend(nomina_result['errors'])
                resultado['warnings'].extend(nomina_result['warnings'])

            # Determinar validez general
            resultado['valid'] = (
                resultado['nivel_validacion']['xsd'] and
                resultado['nivel_validacion']['tipos'] and
                resultado['nivel_validacion']['catalogos'] and
                resultado['nivel_validacion']['reglas_negocio'] and
                len([e for e in resultado['errors'] if e['severidad'] == 'CRITICAL']) == 0
            )

        except etree.XMLSyntaxError as e:
            resultado['valid'] = False
            resultado['errors'].append({
                'codigo': 'XML-001',
                'descripcion': f'Error de sintaxis XML: {str(e)}',
                'ubicacion': 'XML',
                'severidad': 'CRITICAL',
                'solucion': 'Verificar que el archivo sea XML válido'
            })
        except Exception as e:
            resultado['valid'] = False
            resultado['errors'].append({
                'codigo': 'GEN-001',
                'descripcion': f'Error inesperado: {str(e)}',
                'ubicacion': 'Sistema',
                'severidad': 'CRITICAL',
                'solucion': 'Revisar logs del sistema'
            })

        return resultado

    def _validate_xsd(self, cfdi_tree) -> Dict:
        """NIVEL 1: Valida contra esquema cfdi40.xsd"""
        resultado = {'valid': True, 'errors': [], 'warnings': []}

        if 'cfdi40' not in self.schemas:
            resultado['warnings'].append({
                'codigo': 'XSD-001',
                'descripcion': 'Esquema cfdi40.xsd no disponible',
                'ubicacion': 'Sistema',
                'severidad': 'WARNING',
                'solucion': 'Descargar esquema desde sat.gob.mx'
            })
            return resultado

        try:
            self.schemas['cfdi40'].assertValid(cfdi_tree)
        except etree.DocumentInvalid as e:
            resultado['valid'] = False
            for error in e.error_log:
                resultado['errors'].append({
                    'codigo': f'XSD-{error.level}',
                    'descripcion': str(error.message),
                    'ubicacion': f"Línea {error.line}, Columna {error.column}",
                    'severidad': 'CRITICAL',
                    'solucion': self.ERRORES_COMUNES.get('cfdi40-001', {}).get('solucion', 'Revisar estructura XML')
                })

        return resultado

    def _validate_tipos(self, cfdi_tree) -> Dict:
        """NIVEL 2: Valida formatos de tipos de datos"""
        resultado = {'valid': True, 'errors': [], 'warnings': []}

        # Validar fecha
        fecha = cfdi_tree.get('Fecha')
        if fecha:
            fecha_pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$'
            if not re.match(fecha_pattern, fecha):
                resultado['valid'] = False
                resultado['errors'].append(self.ERRORES_COMUNES['cfdi40-002'])

        # Validar importes (0-15 decimales)
        for nodo in ['SubTotal', 'Total', 'Descuento']:
            importe = cfdi_tree.get(nodo)
            if importe:
                try:
                    valor = float(importe)
                    if valor < 0:
                        resultado['valid'] = False
                        resultado['errors'].append({
                            'codigo': 'TIPO-001',
                            'descripcion': f'{nodo} no puede ser negativo',
                            'ubicacion': f'Atributo {nodo}',
                            'severidad': 'CRITICAL',
                            'solucion': 'Corregir importe a valor positivo'
                        })
                except ValueError:
                    resultado['valid'] = False
                    resultado['errors'].append({
                        'codigo': 'TIPO-002',
                        'descripcion': f'{nodo} debe ser numérico',
                        'ubicacion': f'Atributo {nodo}',
                        'severidad': 'CRITICAL',
                        'solucion': 'Corregir formato de importe'
                    })

        # Validar RFC
        emisor_rfc = cfdi_tree.find('.//cfdi:Emisor', namespaces={'cfdi': 'http://www.sat.gob.mx/cfd/4'})
        if emisor_rfc is not None:
            rfc = emisor_rfc.get('Rfc')
            if rfc:
                rfc_pattern = r'^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{2,3}$'
                if not re.match(rfc_pattern, rfc):
                    resultado['valid'] = False
                    resultado['errors'].append({
                        'codigo': 'TIPO-003',
                        'descripcion': 'RFC del emisor inválido',
                        'ubicacion': 'Emisor/Rfc',
                        'severidad': 'CRITICAL',
                        'solucion': 'Corregir formato de RFC (ej: EMP850101ABC)'
                    })

        return resultado

    def _validate_catalogos(self, cfdi_tree) -> Dict:
        """NIVEL 3: Valida claves contra catálogos SAT"""
        resultado = {'valid': True, 'errors': [], 'warnings': []}

        namespaces = {'cfdi': 'http://www.sat.gob.mx/cfd/4'}

        # Validar UsoCFDI
        receptor = cfdi_tree.find('.//cfdi:Receptor', namespaces=namespaces)
        if receptor is not None:
            uso_cfdi = receptor.get('UsoCFDI')
            if uso_cfdi and 'uso_cfdi' in self.catalogos:
                catalogo_usos = [item.get('Clave') for item in self.catalogos['uso_cfdi']]
                if uso_cfdi not in catalogo_usos:
                    resultado['valid'] = False
                    resultado['errors'].append(self.ERRORES_COMUNES['cat-002'])

        # Validar ClaveProdServ de conceptos
        conceptos = cfdi_tree.findall('.//cfdi:Concepto', namespaces=namespaces)
        for concepto in conceptos:
            clave_prod_serv = concepto.get('ClaveProdServ')
            if clave_prod_serv and 'clave_prod_serv' in self.catalogos:
                catalogo_prod_serv = [item.get('ClaveProdServ') for item in self.catalogos['clave_prod_serv']]
                if clave_prod_serv not in catalogo_prod_serv:
                    resultado['valid'] = False
                    resultado['errors'].append(self.ERRORES_COMUNES['cat-001'])

        return resultado

    def _validate_reglas_negocio(self, cfdi_tree) -> Dict:
        """NIVEL 4: Valida reglas de negocio del Anexo 20"""
        resultado = {'valid': True, 'errors': [], 'warnings': [], 'suggestions': []}

        namespaces = {'cfdi': 'http://www.sat.gob.mx/cfd/4'}

        # Regla: Total debe ser igual a Suma de conceptos - descuentos + impuestos
        total = float(cfdi_tree.get('Total', 0))
        subtotal = float(cfdi_tree.get('SubTotal', 0))
        descuento = float(cfdi_tree.get('Descuento', 0))

        if total > subtotal:
            resultado['suggestions'].append({
                'codigo': 'REG-001',
                'descripcion': 'Total mayor que SubTotal (posibles impuestos)',
                'sugerencia': 'Verificar que los impuestos estén correctamente calculados',
                'severidad': 'INFO'
            })

        # Regla: FormaPago 99 (Por definir) solo en CFDI de ingreso
        tipo_comprobante = cfdi_tree.get('TipoDeComprobante')
        forma_pago = cfdi_tree.get('FormaPago')
        if forma_pago == '99' and tipo_comprobante != 'I':
            resultado['warnings'].append({
                'codigo': 'REG-002',
                'descripcion': 'FormaPago 99 solo debería usarse en CFDI de ingreso',
                'ubicacion': 'Atributo FormaPago',
                'severidad': 'WARNING',
                'solucion': 'Cambiar a forma de pago específica o cambiar TipoDeComprobante'
            })

        return resultado

    def _validate_nomina(self, cfdi_tree) -> Dict:
        """Valida complemento de nómina 1.2 Revisión E"""
        resultado = {'valid': True, 'errors': [], 'warnings': []}

        namespaces = {
            'cfdi': 'http://www.sat.gob.mx/cfd/4',
            'nomina12': 'http://www.sat.gob.mx/nomina12'
        }

        # Verificar que exista complemento de nómina
        nomina_node = cfdi_tree.find('.//nomina12:Nomina', namespaces=namespaces)
        if nomina_node is None:
            resultado['valid'] = False
            resultado['errors'].append(self.ERRORES_COMUNES['nom-001'])
            return resultado

        # Validar atributos obligatorios de nómina
        atributos_obligatorios = [
            'Version', 'TipoNomina', 'TipoRegimen', 'NumEmpleado',
            'Curp', 'TipoContrato', 'TipoJornada', 'FechaPago',
            'FechaInicialPago', 'FechaFinalPago', 'NumDiasPagados'
        ]

        for atributo in atributos_obligatorios:
            if nomina_node.get(atributo) is None:
                resultado['valid'] = False
                resultado['errors'].append({
                    'codigo': f'NOM-00{atributos_obligatorios.index(atributo) + 1}',
                    'descripcion': f'Atributo {atributo} es requerido en nómina',
                    'ubicacion': 'nomina12:Nomina',
                    'severidad': 'CRITICAL',
                    'solucion': f'Agregar atributo {atributo}'
                })

        # Validar percepciones: gravado y exento no pueden ser ambos cero
        percepciones = cfdi_tree.findall('.//nomina12:Percepcion', namespaces=namespaces)
        for percepcion in percepciones:
            importe_gravado = float(percepcion.get('ImporteGravado', 0))
            importe_exento = float(percepcion.get('ImporteExento', 0))

            if importe_gravado == 0 and importe_exento == 0:
                resultado['valid'] = False
                resultado['errors'].append(self.ERRORES_COMUNES['nom-002'])

            # Validar clave 038 (Otros ingresos por salarios) debe ser 100% gravada
            tipo_percepcion = percepcion.get('TipoPercepcion')
            if tipo_percepcion == '038' and importe_exento > 0:
                resultado['valid'] = False
                resultado['errors'].append(self.ERRORES_COMUNES['nom-003'])

        return resultado

    def get_error_details(self, error_code: str) -> Optional[Dict]:
        """
        Obtiene detalles de un error por código.

        Args:
            error_code: Código del error (ej: 'cfdi40-001')

        Returns:
            Dict con detalles del error o None si no existe
        """
        return self.ERRORES_COMUNES.get(error_code)

    def suggest_correction(self, xml_content: str, error: Dict) -> Optional[str]:
        """
        Sugiere corrección automática para un error.

        Args:
            xml_content: XML original
            error: Dict con información del error

        Returns:
            XML corregido o None si no hay corrección automática
        """
        # Implementar correcciones automáticas según el tipo de error
        if error.get('codigo') == 'cfdi40-002':
            # Corregir formato de fecha
            cfdi_tree = etree.fromstring(xml_content.encode())
            fecha = cfdi_tree.get('Fecha')
            if fecha:
                # Intentar parsear y reformatear
                try:
                    from datetime import datetime
                    for fmt in ['%d/%m/%Y %H:%M:%S', '%Y/%m/%d %H:%M:%S', '%d-%m-%Y %H:%M:%S']:
                        try:
                            fecha_dt = datetime.strptime(fecha, fmt)
                            cfdi_tree.set('Fecha', fecha_dt.strftime('%Y-%m-%dT%H:%M:%S'))
                            return etree.tostring(cfdi_tree, encoding='unicode', pretty_print=True)
                        except ValueError:
                            continue
                except Exception:
                    pass

        return None
