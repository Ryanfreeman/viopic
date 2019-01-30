export interface Post {    
    createdAt: Date,
    text?: string,
    photoURL?: string,
    videoURL?: any,
    postBy: string,
    user: string,
    username?: string,
    userPhoto?: string,
    likes?: Array<any>,
    comments?: Array<any>,
    location?: Object,
    address?: string,
    postOwner?: string,
    postOwnerId?: string,
    postId?:  string,
    read?: Object
}