export interface Message {
    createdAt: Date,
    userId: string,
    text: string,
    unread?: boolean    
}