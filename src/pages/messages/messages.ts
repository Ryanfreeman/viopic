import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AccountProvider } from '../../providers/account/account';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {


  chats: any[] = [];
  account: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private chatProvider: ChatProvider,
    private accountProvider: AccountProvider,
  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });
  }

  ionViewDidEnter() {
    this.chatProvider.getChats().subscribe(data => {
      this.chats = [];
      data.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        this.chats.push({ uid, ...data });
      });
      console.log('Chats', this.chats);

    })
  }

  searchUser() {
    this.modalCtrl.create('SearchUserPage').present();
  }

  goToChat(chatId) {
    this.modalCtrl.create('MessagesDetailPage', { chatId }).present();
  }

  unread(chat: any) {
    let res: any [] = [];       
    if (chat.messages)
      res = chat.messages.filter(item => {
        if(item.unread && item.userId !== this.account.uid)
          return item;
      });
     
    return res.length > 0;

  }


}
