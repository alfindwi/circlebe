export interface ProfileDTO {
    id: number;
    fullName: string;
    username: string;
    bio: string;
    follow: number;
    following: number;
    avatar: string;
    content: string;
    image?: string;
    createdAt: Date;
    likes?: number;
    replies? : number;
}



