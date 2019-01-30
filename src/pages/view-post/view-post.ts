import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-view-post',
  templateUrl: 'view-post.html',
})
export class ViewPostPage {
  
  
  postId : any;
  post: any[] = [];
  comments: any = null;
  text: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private timelineProvider : TimelineProvider,
    private viewCtrl : ViewController
  ) {
    this.postId = this.navParams.get('postId');
    console.log('PostId', this.postId);
  }

  ionViewWillEnter() {    
    this.timelineProvider.getPost(this.postId).subscribe((res) => {
      this.post = [];
      this.post.push({uid: this.postId, ...res});      
      this.comments = this.post[0].comments;    
    });        
  }
  close() {
    this.viewCtrl.dismiss();
  }

  getDate(date){    
    return moment(new Date(date.seconds * 1000)).fromNow();
  }

}
