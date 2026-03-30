# Fixtures para Tests E2E

Este directorio contiene archivos de prueba utilizados por los tests E2E.

## Archivos de Prueba

### Documentos PDF
- `test-document.pdf` - PDF de prueba para upload (< 10MB)
- `large-file.pdf` - PDF grande para testing de límite de tamaño (> 10MB)

### Documentos XML
- `test-cfdi.xml` - CFDI de prueba para upload

### Estados de Cuenta
- `test-statement.pdf` - Estado de cuenta bancario de prueba

## Generar Archivos de Prueba

Para generar archivos de prueba, ejecuta:

```bash
python tests/e2e/create_test_files.py
```

Esto creará archivos PDF y XML válidos para testing.
