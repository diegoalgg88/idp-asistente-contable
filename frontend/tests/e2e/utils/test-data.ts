/**
 * Datos de Prueba para Tests E2E
 *
 * Colección de datos de prueba reutilizables para tests del IDP Asistente Contable.
 * Incluye credenciales, datos de usuarios, documentos mock, y más.
 *
 * @module tests/e2e/utils/test-data
 */

/**
 * Credenciales de test predefinidas
 */
export const TEST_CREDENTIALS = {
  /** Usuario admin por defecto */
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
  },
  /** Usuario estándar */
  user: {
    email: 'user@example.com',
    password: 'user123',
    fullName: 'Test User',
    role: 'user',
  },
  /** Usuario con permisos limitados */
  viewer: {
    email: 'viewer@example.com',
    password: 'viewer123',
    fullName: 'Viewer User',
    role: 'viewer',
  },
} as const

/**
 * Credenciales inválidas para tests de error
 */
export const INVALID_CREDENTIALS = {
  /** Email inválido */
  invalidEmail: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  /** Password inválido */
  invalidPassword: {
    email: 'admin@example.com',
    password: 'wrongpassword',
  },
  /** Campos vacíos */
  empty: {
    email: '',
    password: '',
  },
} as const

/**
 * Generar email aleatorio único
 *
 * @returns Email único para tests
 */
export function generateRandomEmail(): string {
  const randomId = Math.random().toString(36).substring(2, 10)
  const timestamp = Date.now().toString(36)
  return `test_${timestamp}_${randomId}@example.com`
}

/**
 * Generar password aleatorio
 *
 * @returns Password seguro para tests
 */
export function generateRandomPassword(): string {
  const random = Math.random().toString(36).substring(2, 8)
  return `Test${random}!@#`
}

/**
 * Generar nombre aleatorio
 *
 * @returns Nombre completo aleatorio
 */
export function generateRandomName(): string {
  const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofía']
  const lastNames = ['García', 'Martínez', 'López', 'González', 'Rodríguez', 'Hernández']

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

  return `${firstName} ${lastName}`
}

/**
 * Generar usuario de test único
 *
 * @param overrides - Propiedades para sobreescribir
 * @returns Usuario de test único
 */
export function generateTestUser(overrides?: Partial<TestUser>): TestUser {
  return {
    email: generateRandomEmail(),
    password: 'Test123!@#',
    fullName: generateRandomName(),
    role: 'user',
    ...overrides,
  }
}

/**
 * Interfaz para usuario de test
 */
export interface TestUser {
  email: string
  password: string
  fullName: string
  role: string
}

/**
 * Datos de documentos mock para tests
 */
export const MOCK_DOCUMENTS = {
  /** CFDI de ingreso */
  cfdiIngreso: {
    id: 'doc_cfdi_ingreso_001',
    original_filename: 'cfdi-ingreso-001.pdf',
    document_type: 'cfdi',
    sub_type: 'ingreso',
    status: 'completed' as const,
    file_size: 245678,
    created_at: '2026-03-01T10:00:00.000Z',
    extracted_data: {
      rfc_emisor: 'XAXX010101000',
      rfc_receptor: 'XAXX010101000',
      total: 1160.0,
      subtotal: 1000.0,
      iva: 160.0,
      moneda: 'MXN',
      fecha: '2026-03-01',
    },
  },
  /** CFDI de egreso */
  cfdiEgreso: {
    id: 'doc_cfdi_egreso_001',
    original_filename: 'cfdi-egreso-001.pdf',
    document_type: 'cfdi',
    sub_type: 'egreso',
    status: 'completed' as const,
    file_size: 198234,
    created_at: '2026-03-02T11:30:00.000Z',
    extracted_data: {
      rfc_emisor: 'XAXX010101000',
      rfc_receptor: 'XAXX010101000',
      total: 580.0,
      subtotal: 500.0,
      iva: 80.0,
      moneda: 'MXN',
      fecha: '2026-03-02',
    },
  },
  /** Nómina */
  nomina: {
    id: 'doc_nomina_001',
    original_filename: 'nomina-quincenal-001.pdf',
    document_type: 'nomina',
    sub_type: 'cfdi-nom',
    status: 'completed' as const,
    file_size: 512345,
    created_at: '2026-03-15T09:00:00.000Z',
    extracted_data: {
      rfc_emisor: 'XAXX010101000',
      rfc_receptor: 'XAXX010101000',
      total: 15000.0,
      percepciones: 17400.0,
      deducciones: 2400.0,
      moneda: 'MXN',
      fecha: '2026-03-15',
    },
  },
  /** Documento en procesamiento */
  processing: {
    id: 'doc_processing_001',
    original_filename: 'documento-procesando.pdf',
    document_type: 'cfdi',
    sub_type: 'ingreso',
    status: 'processing' as const,
    file_size: 123456,
    created_at: '2026-03-10T14:00:00.000Z',
    progress: 45,
  },
  /** Documento con error */
  error: {
    id: 'doc_error_001',
    original_filename: 'documento-error.pdf',
    document_type: 'cfdi',
    sub_type: 'ingreso',
    status: 'error' as const,
    file_size: 98765,
    created_at: '2026-03-09T16:30:00.000Z',
    error_message: 'No se pudo extraer el contenido del documento',
  },
} as const

/**
 * Datos de conversaciones mock para tests
 */
export const MOCK_CONVERSATIONS = {
  /** Conversación sobre CFDI */
  cfdiQuery: {
    id: 'conv_cfdi_001',
    title: 'Consulta sobre CFDI',
    created_at: '2026-03-01T10:00:00.000Z',
    updated_at: '2026-03-01T10:05:00.000Z',
    messages: [
      {
        role: 'user' as const,
        content: '¿Qué es un CFDI?',
        timestamp: '2026-03-01T10:00:00.000Z',
      },
      {
        role: 'assistant' as const,
        content: 'Un CFDI (Comprobante Fiscal Digital por Internet) es un documento fiscal digital utilizado en México para comprobar la transferencia de bienes o servicios. Es obligatorio para todos los contribuyentes del SAT.',
        timestamp: '2026-03-01T10:00:05.000Z',
        citations: [
          {
            id: '1',
            source: 'Código Fiscal de la Federación',
            url: 'https://www.gob.mx/sat',
          },
        ],
      },
    ],
  },
  /** Conversación sobre declaraciones */
  declaracionQuery: {
    id: 'conv_declaracion_001',
    title: 'Declaración Anual',
    created_at: '2026-03-02T11:00:00.000Z',
    updated_at: '2026-03-02T11:10:00.000Z',
    messages: [
      {
        role: 'user' as const,
        content: '¿Cuándo se presenta la declaración anual?',
        timestamp: '2026-03-02T11:00:00.000Z',
      },
      {
        role: 'assistant' as const,
        content: 'La declaración anual de personas morales se presenta dentro de los primeros 3 meses siguientes al cierre del ejercicio fiscal. Para personas físicas, el plazo es hasta abril del año siguiente.',
        timestamp: '2026-03-02T11:00:08.000Z',
        citations: [
          {
            id: '1',
            source: 'LISR Artículo 57',
            url: 'https://www.gob.mx/sat',
          },
        ],
      },
    ],
  },
} as const

/**
 * Datos de conciliación bancaria mock para tests
 */
export const MOCK_RECONCILIATION = {
  /** Conciliación exitosa */
  matched: {
    id: 'recon_matched_001',
    bank_transaction: {
      id: 'bank_001',
      date: '2026-03-01',
      amount: 1160.0,
      description: 'TRANSFERENCIA SPEI',
      reference: 'REF001',
    },
    document: {
      id: 'doc_cfdi_ingreso_001',
      folio: 'A001',
      amount: 1160.0,
      date: '2026-03-01',
      rfc: 'XAXX010101000',
    },
    match_score: 0.98,
    status: 'matched' as const,
  },
  /** Conciliación pendiente */
  pending: {
    id: 'recon_pending_001',
    bank_transaction: {
      id: 'bank_002',
      date: '2026-03-02',
      amount: 580.0,
      description: 'PAGO PROVEEDOR',
      reference: 'REF002',
    },
    document: null,
    match_score: 0.0,
    status: 'pending' as const,
  },
  /** Conciliación con diferencia */
  mismatch: {
    id: 'recon_mismatch_001',
    bank_transaction: {
      id: 'bank_003',
      date: '2026-03-03',
      amount: 1200.0,
      description: 'TRANSFERENCIA',
      reference: 'REF003',
    },
    document: {
      id: 'doc_cfdi_ingreso_002',
      folio: 'A002',
      amount: 1160.0,
      date: '2026-03-03',
      rfc: 'XAXX010101000',
    },
    match_score: 0.85,
    difference: 40.0,
    status: 'mismatch' as const,
  },
} as const

/**
 * Mensajes de error esperados
 */
export const ERROR_MESSAGES = {
  /** Error de autenticación */
  auth: 'Credenciales inválidas',
  /** Error de validación */
  validation: 'Campo obligatorio',
  /** Error de archivo */
  file: 'Tipo de archivo no permitido',
  /** Error de red */
  network: 'Error de conexión',
  /** Error genérico */
  generic: 'Ha ocurrido un error',
} as const

/**
 * Selectores de elementos comunes (data-testid)
 */
export const TEST_IDS = {
  // Auth
  emailInput: 'email-input',
  passwordInput: 'password-input',
  loginButton: 'login-button',
  logoutButton: 'logout-button',
  loginError: 'login-error',
  userMenu: 'user-menu',

  // Dashboard
  dashboardTitle: 'dashboard-title',
  statsCards: 'stats-cards',
  totalProcesado: 'stat-total-procesado',
  completados: 'stat-completados',
  confianzaPromedio: 'stat-confianza',
  tiempoPromedio: 'stat-tiempo',

  // Documents
  documentsPane: 'documents-pane',
  uploadButton: 'upload-button',
  fileInput: 'file-input',
  documentList: 'document-list',
  documentRow: 'document-row',

  // Chat
  chatPane: 'chat-pane',
  chatInput: 'chat-input',
  sendMessage: 'send-message',
  messagesList: 'messages-list',
  conversationList: 'conversation-list',
} as const
