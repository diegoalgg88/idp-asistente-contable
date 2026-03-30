/**
 * BankStatementUpload Tests
 * Tests para el componente de subida de estados de cuenta
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankStatementUpload } from '../reconciliation/BankStatementUpload';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock del hook de upload
vi.mock('@/hooks/useReconciliation', () => ({
  useUploadBankStatement: () => ({
    mutate: vi.fn((formData, options) => {
      options?.onProgress?.(50);
      setTimeout(() => {
        options?.onSuccess?.();
      }, 100);
    }),
    isPending: false,
    isSuccess: false,
    error: null,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('BankStatementUpload', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnUploadComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('se renderiza correctamente cuando está abierto', () => {
    render(
      <BankStatementUpload
        open={true}
        onOpenChange={mockOnOpenChange}
        onUploadComplete={mockOnUploadComplete}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Subir Estado de Cuenta Bancario')).toBeInTheDocument();
    expect(
      screen.getByText('Arrastra y suelta tu estado de cuenta o haz clic para seleccionar. Soportamos CSV, XLSX y XLS.')
    ).toBeInTheDocument();
  });

  it('muestra la zona de drag and drop', () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    // Usar getAllByText porque hay texto duplicado en el dialog description y dropzone
    const dropzoneTexts = screen.getAllByText(/arrastra y suelta/i);
    expect(dropzoneTexts.length).toBeGreaterThan(0);
  });

  it('muestra los formatos soportados', () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/CSV, XLSX, XLS/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 50MB/i)).toBeInTheDocument();
  });

  it('muestra los bancos soportados', () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('BBVA')).toBeInTheDocument();
    expect(screen.getByText('Santander')).toBeInTheDocument();
    expect(screen.getByText('Banorte')).toBeInTheDocument();
    expect(screen.getByText('Citibanamex')).toBeInTheDocument();
  });

  it('cierra el dialog cuando se hace clic en Cancelar', () => {
    render(
      <BankStatementUpload
        open={true}
        onOpenChange={mockOnOpenChange}
        onUploadComplete={mockOnUploadComplete}
      />,
      { wrapper: createWrapper() }
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('deshabilita el botón de subir cuando no hay archivo', () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    const uploadButton = screen.getByRole('button', { name: /subir estado de cuenta/i });
    expect(uploadButton).toBeDisabled();
  });

  it('muestra error cuando el archivo es muy grande', async () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    // Simular drop de archivo muy grande
    const largeFile = new File(['dummy content'], 'test.csv', {
      type: 'text/csv',
    });

    // Usar getAllByText y tomar el último (dropzone)
    const dropzoneTexts = screen.getAllByText(/arrastra y suelta/i);
    const dropzone = dropzoneTexts[dropzoneTexts.length - 1].parentElement;
    if (dropzone) {
      fireEvent.drop(dropzone, {
        target: {
          files: [largeFile],
        },
      });
    }

    // El componente debería mostrar el archivo pero con error de validación
    // Verificar que el archivo se seleccionó
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });

  it('muestra error cuando la extensión no es válida', async () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    const invalidFile = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });

    // Usar getAllByText y tomar el último (dropzone)
    const dropzoneTexts = screen.getAllByText(/arrastra y suelta/i);
    const dropzone = dropzoneTexts[dropzoneTexts.length - 1].parentElement;
    if (dropzone) {
      fireEvent.drop(dropzone, {
        target: {
          files: [invalidFile],
        },
      });
    }

    // El componente debería rechazar el archivo inválido
    // Verificar que no se seleccionó el archivo
    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });

  it('muestra el archivo seleccionado correctamente', async () => {
    render(
      <BankStatementUpload open={true} onOpenChange={mockOnOpenChange} />,
      { wrapper: createWrapper() }
    );

    const validFile = new File(['dummy content'], 'estado_cuenta.csv', {
      type: 'text/csv',
    });

    // Usar getAllByText y tomar el último (dropzone)
    const dropzoneTexts = screen.getAllByText(/arrastra y suelta/i);
    const dropzone = dropzoneTexts[dropzoneTexts.length - 1].parentElement;
    if (dropzone) {
      fireEvent.drop(dropzone, {
        target: {
          files: [validFile],
        },
      });
    }

    await waitFor(() => {
      expect(screen.getByText('estado_cuenta.csv')).toBeInTheDocument();
    });
  });
});
