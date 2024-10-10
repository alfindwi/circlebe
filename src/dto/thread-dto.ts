export type CreateThreadDTO = {
    content: string;
    image?: string | null; 
    threadId: number
    userId: number;
    fullName: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}


export type UpdateThreadDTO = CreateThreadDTO & {
    id: number;
}