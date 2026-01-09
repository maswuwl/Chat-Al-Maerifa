
export enum MessageRole {
  USER = 'user',
  AI = 'ai'
}

export enum ContentType {
  TEXT = 'text',
  CODE = 'code',
  VIDEO = 'video',
  PROJECT = 'project'
}

export type VerificationType = 'gold' | 'red' | 'blue' | 'none';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  diamonds: number;
  email: string;
  job: string;
  role: 'admin' | 'creator' | 'user';
  joinDate: string; // ISO format
  isPremium: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: ContentType;
  metadata?: {
    videoUrl?: string;
    files?: ProjectFile[];
    language?: string;
    filePath?: string;
  };
  isStreaming?: boolean;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface IDCardData {
  name: string;
  job: string;
  city: string;
  age: string;
  gender: string;
  bloodType: string;
  deviceId: string;
  cardNumber: string;
  expiryDate: string;
  issueDate: string;
  photoUrl: string;
  signatureUrl: string;
}
