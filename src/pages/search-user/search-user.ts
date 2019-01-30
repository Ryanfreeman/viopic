import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';



@IonicPage()
@Component({
  selector: 'page-search-user',
  templateUrl: 'search-user.html',
})
export class SearchUserPage {

  users: any[] = [];
  userList: any[] = [];
  searchStr: string = '';
  account: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private accountProvider: AccountProvider
  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });
  }

  ionViewWillEnter() {
    this.accountProvider.getUsers().subscribe((data: any) => {
      this.userList = [];
      this.users = [];
      this.userList = data;
      this.users = data.filter(item => this.account.following[item.uid] ? item : null);
      console.log(this.users);

    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

  search(ev: any) {
    this.searchStr = ev.target.value;

    if (this.searchStr && this.searchStr.trim() != '') {

      this.users = this.userList.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 ||
          item.username.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1);
      })
    } else {
      this.users = this.userList.filter((item) =>
        this.account.following[item.uid] ? item : null
      );
    }
  }



}
