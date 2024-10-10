export interface createReplyDTO {
    content: string;
    image?: string | null; 
    likes?: number;  // If likes is not needed, remove it
    threadId: number; // Ensure threadId is a number, not string
    userId: number;
}
