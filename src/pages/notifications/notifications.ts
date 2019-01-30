import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import moment from 'moment';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Notification } from '../../models/notification';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  account: any;
  notifications: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private accountProvider: AccountProvider,
    private timelineProvider: TimelineProvider,
    private modalCtrl: ModalController


  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
    });
  }

  ionViewDidEnter(){
    this.timelineProvider.readNotifications();
  }

  ionViewWillEnter() {
    this.timelineProvider.getNotifications()
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.notifications = [];

          if (this.account.following) {
            this.notifications = data.filter(item => {
              item.text = item.text.replace(/VK_RETURN/g, '');
              return this.account.following[item.userId] && item
            });
          }
        }
        if (!this.notifications)
          this.notifications = null;
        console.log('Notifications', this.notifications);

      });
  }

  getDate(date) {

    return moment(new Date(date.seconds * 1000)).fromNow();
  }


  openPost(postId) {
    this.modalCtrl.create('ViewPostPage', { postId: postId }).present();
    console.log('Opening:', postId);
  }



}
