import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account';
import { ImageProvider } from '../image/image';


@Injectable()
export class AccountProvider {
  account: Observable<Account>;

  constructor(
    private afs: AngularFirestore,
    private afa: AngularFireAuth,
    private imageProvider: ImageProvider
  ) {
    console.log('Hello AccountProvider Provider');
  }

  getAccount(userId = null) {
    const currentUser = userId ? userId : this.afa.auth.currentUser.uid;
    const doc: AngularFirestoreDocument<Account> = this.afs.doc('accounts/' + currentUser);
    return this.account = doc.valueChanges();
  }

  getUsers() {
    return this.afs.collection('accounts').valueChanges();
  }

  getAccountEmailByUsername(username) {
    const currentUser = this.afa.auth.currentUser.uid;
    const doc: AngularFirestoreCollection<Account> = this.afs.collection('accounts', ref => ref.where('username', '==', username));
    return doc.valueChanges();
  }

  getUserIdByUsername(username) {    
    console.log(username);    
    return new Promise((resolve) => {      
      this.afs.collection('accounts', ref => ref.where('username', '==', username))
      .valueChanges().subscribe((data: any) => {
        console.log(data[0]);
        
        resolve(data[0].uid);
      });
    });
  }

  async updateAccount(obj: Account) {
    const currentUser = this.afa.auth.currentUser.uid;
    const doc = this.afs.doc('accounts/' + currentUser);
    obj.username = obj.username.substr(0, 1) !== '@' ? '@' + obj.username : obj.username.trim();
    obj.username.replace(/\s/g, '').split(' ').join('').replace(/ /g,'').replace(/\s+/g,'');
    console.log(obj.username);
    try {
      if (obj.photoURL)
        obj.photoURL = <string>await this.imageProvider.uploadProfilePhoto(currentUser, obj.photoURL);

      if (obj.coverPhotoURL)
        obj.coverPhotoURL = <string>await this.imageProvider.uploadProfilePhoto(currentUser, obj.coverPhotoURL);
    } catch (e){
      console.log(e);
    }

    return this.afs.doc('accounts/' + currentUser).update({...obj})
    .catch(err => console.log(err));
  }

  async follow(userId) {
    const currentUser = this.afa.auth.currentUser.uid;
    let following: any;
    following = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe((user: any) => {
          let following = user.following;
          following = { [userId]: true, ...following };

          resolve(following);
        })
    });
    console.log(following);

    this.afs.doc('accounts/' + currentUser).update({ following: following });

    let followers: any;
    followers = await new Promise((resolve) => {
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe((user: any) => {
          let followers = user.followers;
          followers = { [currentUser]: true, ...followers };

          resolve(followers);
        })
    });

    this.afs.doc('accounts/' + userId).update({ followers: followers });

  }

  async unfollow(userId) {
    const currentUser = this.afa.auth.currentUser.uid;
    let following: any;
    following = await new Promise((resolve) => {
      this.afs.doc('accounts/' + currentUser).valueChanges()
        .subscribe((user: any) => {
          let following = user.following;
          delete following[userId];

          resolve(following);
        })
    });
    this.afs.doc('accounts/' + currentUser).update({ following: following });
    let followers: any;
    followers = await new Promise((resolve) => {
      this.afs.doc('accounts/' + userId).valueChanges()
        .subscribe((user: any) => {
          let followers = user.followers;
          delete followers[currentUser];

          resolve(followers);
        })
    });

    this.afs.doc('accounts/' + userId).update({ followers: followers });
  }



}
