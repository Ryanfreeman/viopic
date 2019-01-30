import { Message } from './message';
export interface Chat {
    users: Object,
    createdBy: string,
    recipient: string,
    recipientPhoto: string,  
    sender: string,
    senderPhoto: string,
    messages?: Array<Message>
    
}