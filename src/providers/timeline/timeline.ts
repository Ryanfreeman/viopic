import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Post } from '../../models/post';
import { Notification } from '../../models/notification';
import { ImageProvider } from '../../providers/image/image';

@Injectable()
export class TimelineProvider {

  limit: number = 10;
  public searchStr = '';
  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private imageProvider: ImageProvider,
    private alertCtrl: AlertController
  ) {

  }


  addPost(obj: Post) {
    return new Promise((resolve) => {
      const userId = this.afa.auth.currentUser.uid;
      obj.postBy = userId;
      console.log('post', obj);
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe(async (user: any) => {
          console.log('post', user);

          obj.user = user.name;
          obj.username = user.username;
          if (user.photoURL)
            obj.userPhoto = user.photoURL;

          if (obj.photoURL && !obj.photoURL.includes('http')) {
            const photoURL: any = await this.imageProvider.uploadPostPhoto(userId, obj.photoURL);
            obj.photoURL = photoURL;
          }

          if (obj.videoURL && !obj.videoURL.includes('http')) {
            const videoURL: any = await this.imageProvider.uploadPostVideo(userId, obj.videoURL);
            obj.videoURL = videoURL;
          }

          this.afs.collection('posts').add(obj)
            .then(res => resolve(res))
            .catch(err => console.log(err));
          console.log("share", obj.postId);

          await this.afs.doc('posts/' + obj.postId).valueChanges()
            .subscribe((res: any) => {
              let sharing: any = res.sharing;
              sharing = { userId, ...sharing };
              this.afs.doc('posts/' + obj.postId).update({ sharing: sharing });
            })
        });


    });

  }

  sharePost(obj: any) {
    return new Promise((resolve) => {
      const userId = this.afa.auth.currentUser.uid;
      obj.postBy = userId;
      console.log('post', obj);
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe(async (user: any) => {
          console.log('post', user);

          obj.user = user.name;
          if (user.photoURL)
            obj.userPhoto = user.photoURL;

          if (obj.photoURL) {
            const photoURL: any = await this.imageProvider.uploadPostPhoto(userId, obj.photoURL);
            obj.photoURL = photoURL;
          }

          await this.afs.collection('posts').add(obj)
            .then(res => resolve(res))
            .catch(err => console.log(err));
          console.log("share", obj.postId);

          await this.afs.doc('posts/' + obj.postId).valueChanges()
            .subscribe((res: any) => {
              let sharing: any = res.sharing;
              sharing = { userId, ...sharing };
              this.afs.doc('posts/' + obj.postId).update({ sharing: sharing });
            })

          this.createNotification(obj.uid, 'shared');
        })
    });

  }

  deletePost(postId) {
    //remove image
    this.alertCtrl.create({
      title: "Delete Post",
      subTitle: "Are you sure you want to delete this post?",
      buttons: [
        {
          text: "No",
          handler: () => console.log('cancel')
        },
        {
          text: "Yes",
          handler: () => {
            this.afs.collection('posts').doc(postId).delete()
              .catch(err => console.log(err));
          }
        }

      ]
    }).present();
  }

  async likePost(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let likes = post.likes;
          likes = { [userId]: true, ...likes };

          resolve(likes);
        })
    });

    await this.afs.doc('posts/' + postId).update({ "likes": likes });
    this.createNotification(postId, 'liked');

  }

  async dislikePost(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let likes: any;
    likes = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let likes = post.likes;
          delete likes[userId];

          resolve(likes);
        })
    });

    this.afs.doc('posts/' + postId).update({ "likes": likes });
  }

  async addToBookmark(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let bookmark: any;
    bookmark = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let bookmark = post.bookmark;
          bookmark = { [userId]: true, ...bookmark };
          resolve(bookmark);
        })
    });

    this.afs.doc('posts/' + postId).update({ bookmark: bookmark });
  }

  async removeFromBookmark(postId) {
    const userId = this.afa.auth.currentUser.uid;
    let bookmark: any;
    bookmark = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let bookmark = post.bookmark;

          delete bookmark[userId];
          resolve(bookmark);
        })
    });

    this.afs.doc('posts/' + postId).update({ bookmark: bookmark });
  }

  async commentPost(postId, obj) {
    const userId = this.afa.auth.currentUser.uid;
    let comments: any;
    comments = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe((post: any) => {
          let comments: any;
          if (post)
            comments = post.comments;
          const comment = {
            user: obj.user,
            photoURL: obj.photoURL ? obj.photoURL : null,
            createdAt: obj.createdAt,
            commentBy: obj.commentBy,
            text: obj.text
          };
          if (comments) {
            comments.push(comment);
          } else {
            comments = [comment];
          }
          resolve(comments);
        })
    });

    await this.afs.doc('posts/' + postId).update({ comments: comments });
    this.createNotification(postId, 'commented');
  }

  //Notifications
  async createNotification(postId, event) {
    const currentUser = this.afa.auth.currentUser.uid;
    let post: any = await new Promise((resolve) => {
      this.afs.doc('posts/' + postId).valueChanges()
        .subscribe(post => resolve(post));
    });

    let user: any = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe(user => resolve(user));
    });

    const notification: Notification = {
      event: event,
      userId: currentUser,
      user: user.name,
      userPhoto: user.photoURL,
      owner: post.user,
      postId: postId,
      createdAt: new Date(),
      text: post.text
    }

    await this.afs.collection('notifications').add(notification)
      .catch(err => console.log(err));

  }

  readPosts() {
    const currentUser = this.afa.auth.currentUser.uid;
    this.afs.collection('posts')
      .snapshotChanges()
      .subscribe((data: any[]) => {
        data.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          console.log('reading', data);
          if (!data.users || !data.users[currentUser] || data.users[currentUser] === false) {
            const users = { ...data.users, [currentUser]: true };
            this.afs.doc(`posts/${uid}`).update({
              users
            });
          }
        });

      });
  }

  async addView(postId) {
    console.log('Adding views');
    const post: any = await new Promise((resolve) => {
      this.afs.doc(`posts/${postId}`).valueChanges().subscribe(res => resolve(res));
    });
    let views = 1;
    
    console.log(post);

    if (post && ('views' in post)) {
      views = post.views + 1;
    }
    console.log('views', views);
    await this.afs.doc(`posts/${postId}`).update({
      views: views
    });
  }

  isPostUnread() {
    const currentUser = this.afa.auth.currentUser.uid;
    return this.afs.collection('posts')
      .valueChanges()
      .map((data: any) => {
        console.log('Unread POsts', data);
        let res: any[] = [];
        data.forEach(post => {
          if (!post.users || !post.users[currentUser])
            res.push(post);
        });

        return res;
      });

  }


  readNotifications() {
    const currentUser = this.afa.auth.currentUser.uid;
    this.afs.collection('notifications')
      .snapshotChanges()
      .subscribe((data: any[]) => {
        data.map(a => {
          const data = a.payload.doc.data();
          const uid = a.payload.doc.id;
          console.log('reading', data);
          if (!data.users || !data.users[currentUser] || data.users[currentUser] === false) {
            const users = { ...data.users, [currentUser]: true };
            this.afs.doc(`notifications/${uid}`).update({
              users
            });
          }
        });

      });
  }

  isNotificationUnread() {
    const currentUser = this.afa.auth.currentUser.uid;
    return this.afs.collection('notifications')
      .valueChanges()
      .map((data: any) => {
        console.log('Unread Notifications', data);
        let res: any[] = [];
        data.forEach(notification => {
          if (!notification.users || !notification.users[currentUser])
            res.push(notification);
        });

        return res;
      });

  }

  getNotifications() {
    return this.afs.collection('notifications', ref => ref.orderBy('createdAt', 'desc')).valueChanges();
  }



  //Timelines
  getAllPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')/*.limit(this.limit)*/).snapshotChanges();
  }

  getUserPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('postBy', '==', userId).orderBy('createdAt', 'desc')).snapshotChanges();
  }

  getLikedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('likes.' + userId, '==', true)).snapshotChanges();
  }

  getBookmarkedPosts(userId) {
    return this.afs.collection('posts', ref => ref.where('bookmark.' + userId, '==', true)).snapshotChanges();

  }

  getFollowingPosts() {
    return this.afs.collection('posts', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges();

  }

  getPost(postId) {
    return this.afs.collection('posts').doc(postId).valueChanges();
  }

  




}
