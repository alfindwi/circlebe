export interface ReplyDTO {
    id: number;
    content: string;
    image?: string | null;
    likes: number;
    threadId: number;
    userId: number; 
    createdAt: Date;
    updatedAt: Date;
}
  