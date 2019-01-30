import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AccountProvider } from '../../providers/account/account';
import { LoadingProvider } from '../../providers/loading/loading';

@IonicPage()
@Component({
  selector: 'page-messages-detail',
  templateUrl: 'messages-detail.html',
})
export class MessagesDetailPage {

  @ViewChild(Content) content: Content;

  chatId: any;
  chat: any;
  text: string = '';
  account: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private chatProvider : ChatProvider,
    private accountProvider : AccountProvider,
    private viewCtrl : ViewController,
    private loadingProvider : LoadingProvider
  ) {
    this.chatId = this.navParams.get('chatId');
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });
  }

  ionViewDidEnter() {
    this.loadingProvider.show();
    this.chatProvider.getChat(this.chatId).subscribe(async(data) => {
      await this.chatProvider.readMessage(this.chatId);      
      this.chat = data;
      console.log(this.chat);      
      await this.loadingProvider.hide();
      this.content.scrollToBottom(200);      
    });
    
  }

  async sendMessage(){
    await this.chatProvider.sendMessage(this.chatId, this.text);
    this.content.scrollToBottom(200);
    this.text = '';
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
