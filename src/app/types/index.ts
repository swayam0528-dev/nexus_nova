export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Order {
  id: string;
  partName: string;
  material: string;
  quantity: number;
  deadline: string;
  status: 'Received' | 'In Review' | 'Accepted';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  qualityNotes: QualityNote[];
}

export interface QualityNote {
  id: string;
  note: string;
  timestamp: string;
  addedBy: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface ParsedIntent {
  action: 'create_order' | 'update_status' | 'add_quality_note' | 'query' | 'unknown';
  entities: {
    orderId?: string;
    partName?: string;
    material?: string;
    quantity?: number;
    deadline?: string;
    status?: 'Received' | 'In Review' | 'Accepted';
    qualityNote?: string;
  };
  confidence: number;
}
