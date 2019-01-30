import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';

/**
 * Generated class for the FollowListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-follow-list',
  templateUrl: 'follow-list.html',
})
export class FollowListPage {
  title: string;
  type: string;
  userId: any;
  account: any;
  users: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private accountProvider: AccountProvider
  ) {
    this.title = this.navParams.get('title');
    this.userId = this.navParams.get('userId');
    this.accountProvider.getAccount(this.userId).subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });
  }

  ionViewDidLoad() {
    this.type = this.navParams.get('type');    

  }

  async ionViewWillEnter() {
    await this.accountProvider.getUsers().subscribe(data => {      
      this.users = [];
      data.forEach((user: any) => {        
        if (this.account[this.type][user.uid]){         
          this.users.push(user);
        }

      })



      console.log(this.users);

    });
  }

}
