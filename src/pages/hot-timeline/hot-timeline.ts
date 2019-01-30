import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import moment from 'moment';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';



@IonicPage()
@Component({
  selector: 'page-hot-timeline',
  templateUrl: 'hot-timeline.html',
})
export class HotTimelinePage {

  timeline:any[] = []; //Array<Post>;
  account: any;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider : AccountProvider,
    private modalCtrl : ModalController

  ) {
    this.accountProvider.getAccount(null).subscribe((data) => {
      this.account = data;
      console.log(this.account);
      
    });
  }

  ionViewWillEnter() {

    this.timelineProvider.getFollowingPosts().subscribe((data) => {
      console.log(data);
      this.timeline = [];
      data.map(a => {
        const data = a.payload.doc.data() ;
        const uid = a.payload.doc.id;
        if (Object.keys(this.account.following).indexOf(data.postBy) > -1)
          this.timeline.push( { uid, ...data });
      });
      // this.timeline = data;
    });
    console.log(this.timeline);
  } 

  addPost () {
    this.modalCtrl.create('AddPostPage').present();    
  }
 

  //Current User Profile
  openProfile(){
    this.modalCtrl.create('ProfilePage', {userId: this.account.uid}).present();

  }

  //Other User Profile
  goToProfile(userId){
    this.modalCtrl.create('ProfilePage', {userId: userId}).present();
  }

}
