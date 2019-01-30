import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TimelineProvider } from '../../providers/timeline/timeline';
import { Comment } from '../../models/comment';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-comment-post',
  templateUrl: 'comment-post.html',
})
export class CommentPostPage {

  postId : any;
  post: any;
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
      this.post = res;
      console.log('Post',this.post);  
      this.comments = this.post.comments    
    });        
  }

  postComment(){
    const account = this.navParams.get('account');
    const comment : Comment = {
      user: account.name,
      photoURL: account.photoURL,
      commentBy: account.uid,
      text: this.text,
      createdAt : new Date()
    }
    console.log('New Comment', comment);
    this.timelineProvider.commentPost(this.postId, comment).then(() => {
      this.text = '';
    });
  }

  close(){
    this.viewCtrl.dismiss();
  }

  getDate(date){
    
    return moment(new Date(date.seconds * 1000)).fromNow();
  }

}
