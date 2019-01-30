export interface Notification {
    userPhoto?: string,
    userId: string,
    user: string,
    postId: string,
    createdAt: Date,
    event: string,
    owner?: string,
    text?: string
}