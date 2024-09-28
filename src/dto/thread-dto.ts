export type CreateThreadDTO = {
    content: string;
    image?: string; 
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