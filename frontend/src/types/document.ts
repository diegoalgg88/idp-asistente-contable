export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface ExtractionData {
  [key: string]: any
}

export interface Document {
  id: string;
  user_id: number;
  original_filename: string;
  file_path: string;
  file_url: string;
  document_type: string;
  status: DocumentStatus;
  confidence_score: number;
  extracted_data: ExtractionData;
  created_at: string;
}

export interface DocumentUploadResponse {
  message: string;
  document_id: string;
}

export interface BatchProcessResponse {
  batch_id: string;
  total_files: number;
  documents?: Document[];
}

export interface ProcessingStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}
