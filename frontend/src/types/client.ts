export interface Client {
  id: string;
  name: string;
  email: string;
  rfc: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'moral' | 'fisica';
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  rfc: string;
  type: 'moral' | 'fisica';
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: 'active' | 'inactive' | 'pending';
}
