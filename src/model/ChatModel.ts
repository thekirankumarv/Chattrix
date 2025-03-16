//src/model/ChatModel.ts
export interface ChatModel {
    id: string; 
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: number; 
    isRead: boolean;
    lastMessage?: string;
    lastMessageRead: boolean;
  }
  