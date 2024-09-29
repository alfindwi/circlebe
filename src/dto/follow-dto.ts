export interface CreateFollowDTO {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: Date;
    updatedAt: Date;
}