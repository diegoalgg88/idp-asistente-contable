export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  client_id: string;
  budget: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  client_id: string;
  budget: number;
  start_date: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}
