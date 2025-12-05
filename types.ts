export interface Attachment {
  file: File;
  previewUrl: string;
  mimeType: string;
  base64Data?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
