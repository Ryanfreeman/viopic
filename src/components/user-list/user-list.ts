import { Component, Input } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { ChatProvider } from '../../providers/chat/chat';
import { Post } from '../../models/post';
import moment from 'moment';



@Component({
  selector: 'user-list',
  templateUrl: 'user-list.html'
})

export class UserListComponent {

  @Input() users: any[];
  @Input() chat: boolean = false;  

  
  account: any;
  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider: AccountProvider,
    private modalCtrl: ModalController,
    private viewCtrl : ViewController,
    private chatProvider : ChatProvider

  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });
    
  }

  followingStatus(userId){
    if (this.account.following){
      if (this.account.following[userId])
        return true;
    }
    return false;
  }

  follow(userId){
    this.accountProvider.follow(userId);
  }

  unfollow(userId){
    this.accountProvider.unfollow(userId);
  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }

  async startChat(user){
    const { uid, name, photoURL } = user;
    console.log('Add.Chat', { uid, name, photoURL });
    
    await this.chatProvider.openChat(this.viewCtrl, { uid, name, photoURL }, this.account);
  }

}
