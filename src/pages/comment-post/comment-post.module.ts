import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentPostPage } from './comment-post';

@NgModule({
  declarations: [
    CommentPostPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentPostPage),
  ],
})
export class CommentPostPageModule {}
