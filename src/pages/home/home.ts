import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, InfiniteScroll, Content, Events, Platform } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  limit: number = 10;
  timeline:any[] = []; //Array<Post>;
  account: any;
  ios: boolean;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider : AccountProvider,
    private modalCtrl : ModalController,
    private events: Events,
    private platform : Platform

  ) {
    this.ios = this.platform.is('ios');
    this.events.subscribe('home:scrollToTop', (time) => {
      console.log('home:scrollToTop', 'at', time);
      this.content.scrollToTop();
    });
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });
  }

  async ionViewWillEnter() {    
    console.log(this.timeline);
    await this.getPosts();    
  } 

  ionViewDidEnter(){
    this.timelineProvider.readPosts();
  }

  getPosts(){
    this.timelineProvider.getFollowingPosts().subscribe((data) => {
      console.log(data);
      this.timeline = [];
      const following = this.account && "following" in this.account && this.account['following'] || {};
      const userId = this.account && this.account.uid;

      const userIds = {...following, [userId]: true};
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;          
       
        
        if ((Object.keys(userIds).indexOf(data.postBy) > -1)){
          console.log(this.timeline.filter(a => a.uid === uid));
          console.log(this.timeline);
          this.timeline.push( { uid, ...data });
        }
      });
    
    });
   
  }
  //Current User Profile
  openProfile(){
    this.modalCtrl.create('ProfilePage', {userId: this.account.uid}).present();

  }
  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }
  //infinite scroll
  doInfinite(infiniteScroll : InfiniteScroll) {
    console.log('Begin async operation');
    this.timelineProvider.limit += 10;
    setTimeout(async () => {
      await this.getPosts();
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
}
