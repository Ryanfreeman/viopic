import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { TabsProvider } from '../../providers/tabs/tabs';
import { Post } from '../../models/post';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  view: string = "posts";
  searchStr: string = '';

  timeline: any[] = []; //Array<Post>;
  topPosts: any[] = [];
  imagePosts: any[] = [];
  list: any[] = [];

  users: any[] = [];
  userList: any[] = [];

  account: any;


  constructor(
    public navCtrl: NavController,
    public navParams : NavParams,
    private timelineProvider: TimelineProvider,
    private accountProvider: AccountProvider,
    private modalCtrl: ModalController,
    private tabsProvider: TabsProvider

  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });
    
    
  }
  ngDoCheck() {
    this.searchStr = this.timelineProvider.searchStr;
  }

  ionViewWillEnter() {
    this.searchStr = this.timelineProvider.searchStr;
   

    this.timelineProvider.getAllPosts().subscribe((data) => {
      console.log(data);
      this.timeline = [];
      this.list = [];
      data.map(a => {
        const data = a.payload.doc.data();
        const uid = a.payload.doc.id;
        this.list.push({ uid, ...data });
        
        if (this.searchStr && this.searchStr !== '')
          this.search({ target: {value: this.searchStr }});
      });
      // this.list = this.timeline;
      this.topPosts.sort((a, b) => {
        return (this.countEv(a.sharing) > this.countEv(b.sharing)) ? -1 :
          ((this.countEv(b.sharing) > this.countEv(a.sharing)) ? 1 : 0);
      });
      // this.timeline = data;
    });

    this.accountProvider.getUsers().subscribe(data => {
      this.userList = data;

      this.users = [];

      if (this.searchStr && this.searchStr !== '') 
        this.search({ target: {value: this.searchStr }});     
      
      
      console.log(this.users);

    });
    console.log(this.timeline);
  }

  ionViewDidEnter() {
    this.tabsProvider.hide();

  }




  search(ev: any) {
    this.searchStr = ev.target.value;

    if (this.view === 'posts') {
      if (this.searchStr && this.searchStr.trim() != '') {

        this.timeline = this.list.filter((item) => {
          return (item.text ? item.text.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 : null);
        })
      } else {
        this.timeline = [];
        // this.list.filter((item) => {
        //   console.log(item);
        //   return (item);
        // });
      }
    }
    if (this.view === 'people') {
      if (this.searchStr && this.searchStr.trim() !== '') {

        this.users = this.userList.filter((item) => {
          return (item.name.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 ||
            item.username.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1);
        })
      } else {
        this.users = [];
        // this.userList.filter((item) => {
        //   return (item);
        // });
      }
    }

    if (this.view === 'top') {
      if (this.searchStr && this.searchStr.trim() != '') {

        this.topPosts = this.list.filter((item) => {
          return (item.text ? item.text.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 : null);
        }).sort((a, b) => {
          return (this.countEv(a.sharing) > this.countEv(b.sharing)) ? -1 :
            ((this.countEv(b.sharing) > this.countEv(a.sharing)) ? 1 : 0);
        });
      } else {
        this.topPosts = [];
        // this.list.filter((item) => {
        //   console.log(item);
        //   return (item);
        // }).sort((a, b) => {
        //   return (this.countEv(a.sharing) > this.countEv(b.sharing)) ? -1 :
        //     ((this.countEv(b.sharing) > this.countEv(a.sharing)) ? 1 : 0);
        // });
      }
    }

    if (this.view === 'photos') {
      if (this.searchStr && this.searchStr.trim() != '') {

        this.imagePosts = this.list.filter((item) => {
          return ((item.user.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 ||
            item.text ? item.text.toLowerCase().indexOf(this.searchStr.toLowerCase()) > -1 : null) &&
            item.photoURL);
        });
      } else {
        this.imagePosts = []
        // this.list.filter((item) => {
        //   console.log(item);
        //   return (item.photoURL);
        // });
      }
    }

  }

  //Other User Profile
  goToProfile(userId) {
    this.modalCtrl.create('ProfilePage', { userId: userId }).present();
  }

  countEv(obj) {
    if (obj)
      return Object.keys(obj).length;
    return 0;
  }

  close() {
    this.tabsProvider.show();
    this.timelineProvider.searchStr = ''    ;
    this.navCtrl.parent.select(0);    
  }




}
