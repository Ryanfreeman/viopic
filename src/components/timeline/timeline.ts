import { Component, Input, ViewChild } from '@angular/core';
import { NavController, ModalController, Content, App } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { AccountProvider } from '../../providers/account/account';
import { Post } from '../../models/post';
import moment from 'moment';


@Component({
  selector: 'timeline',
  templateUrl: 'timeline.html'
})
export class TimelineComponent {

  @Input() timeline: any[];
  @ViewChild('video') video: any;


  account: any;

  constructor(
    public navCtrl: NavController,
    private timelineProvider: TimelineProvider,
    private accountProvider: AccountProvider,
    private modalCtrl: ModalController,
    private app: App


  ) {
    console.log('Hi');

    this.accountProvider.getAccount().subscribe((data) => {
      this.account = data;
      console.log(this.account);

    });


    console.log(this.timeline);
  }

  ionViewWillEnter() {


  }

  like(uid) {
    this.timelineProvider.likePost(uid);
  }

  dislike(uid) {
    this.timelineProvider.dislikePost(uid);
  }

  addToBookmark(uid) {
    this.timelineProvider.addToBookmark(uid);
  }

  removeFromBookmark(uid) {
    this.timelineProvider.removeFromBookmark(uid);
  }

  addPost() {
    this.modalCtrl.create('AddPostPage').present();
  }

  deletePost(postId) {
    this.timelineProvider.deletePost(postId);
  }

  getDate(date) {
    if (date)
      return moment(new Date(date.seconds * 1000)).fromNow();
    return moment(new Date()).fromNow();
  }

  likeState(likes: any) {
    if (likes) {
      if (likes[this.account.uid])
        return true;
    }
    return false;
  }

  bookmarkState(bookmark: any) {
    if (bookmark) {
      if (bookmark[this.account.uid])
        return true;
    }
    return false;
  }


  commentState(comments: any) {
    if (comments) {
      //myArray.map(function(e) { return e.hello; }).indexOf('stevie');
      if (comments.map((e) => e.commentBy).indexOf(this.account.uid) !== -1)
        return true;
    }
    return false;
  }

  comment(postId) {
    console.log('PostId.Home', postId);
    this.modalCtrl.create('CommentPostPage', { postId: postId, account: this.account }).present();
  }

  sharePost(post) {
    console.log('Sharing', post);
    this.modalCtrl.create('AddPostPage',
      {
        text: post.text,
        postOwner: post.user,
        postOwnerId: post.postBy,
        postId: post.uid,
        photoURL: post.photoURL || null,
        videoURL: post.videoURL || null
      }).present();
  }

  //Current User Profile
  openProfile() {
    this.modalCtrl.create('ProfilePage').present();

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

  viewPost(postId) {
    this.modalCtrl.create('ViewPostPage', { postId: postId }).present();
  }

  //Create text array
  createStrArray(text: String) {
    let str = text;
    if (!str || str === '')
      return '';

    let res = str.split(/[ ]/);
    return res;
  }

  //Open Search
  searchByTag(text) {
    console.log('searchStr', text);
    this.timelineProvider.searchStr = text;
    const nav = this.app.getActiveNav();

    console.log('Active', this.navCtrl.getActive().name);
    if ((this.navCtrl.getActive().name !== 'HomePage') && (this.navCtrl.getActive().name !== 'SearchPage'))
      this.navCtrl.pop();
    if (this.navCtrl.getActive().name !== 'SearchPage')
      nav.parent.select(1);
  }

  async openProfileByQuote(quote) {
    let userId = await this.accountProvider.getUserIdByUsername(quote);
    console.log(userId);
    this.goToProfile(userId);

  }



  isURL(text) {
    var pattern = new RegExp('(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'); // fragment locater
    if (!pattern.test(text)) {
      return false;
    } else {
      return true;
    }
  }

  openBrowser(url: string) {
    if (!url.includes('//'))
      url = 'http://' + url;
    (<any>window).open(url);
  }

  play(postId) {
    this.timeline[this.timeline.findIndex(x => x.uid == postId)].views += 1;    
  }

  addView(postId){
    this.timelineProvider.addView(postId);
  }

}

