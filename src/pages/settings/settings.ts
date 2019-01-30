import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AccountProvider } from '../../providers/account/account';
import { Account } from '../../models/account';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoadingProvider } from '../../providers/loading/loading';
import { LoginPage } from '../../pages/login/login';
import { AngularFirestore } from 'angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild('description') description: ElementRef;

  view: string = 'profile';
  account: Account;
  image: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private accountProvider: AccountProvider,
    private alertCtrl: AlertController,
    private camera: Camera,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private toast: ToastController,
    private loadingProvider: LoadingProvider
  ) {
  }

  ionViewDidLoad() {
    this.accountProvider.getAccount().subscribe((res) => {
      this.account = res;
    })
  }

  resize() {
    console.log(this.description);
    var element = this.description['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.description['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';

  }

  async close() {
    await this.save();
    this.viewCtrl.dismiss();
  }

  choosePhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let alert = this.alertCtrl.create({
      title: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {

            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }).then((imageData) => {
              console.log(imageData);

              this.account.photoURL = 'data:image/jpeg;base64,' + imageData;
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.CAMERA
            }).then((imageData) => {
              console.log(imageData);

              this.account.photoURL = 'data:image/jpeg;base64,' + imageData;
            });
          }
        }
      ]
    }).present();
  }

  chooseCoverPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let alert = this.alertCtrl.create({
      title: 'Set Cover Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {

            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }).then((imageData) => {
              console.log(imageData);

              this.account.coverPhotoURL = 'data:image/jpeg;base64,' + imageData;
            });
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.camera.getPicture({
              quality: 50,
              targetWidth: 384,
              targetHeight: 384,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              correctOrientation: true,
              sourceType: this.camera.PictureSourceType.CAMERA
            }).then((imageData) => {
              console.log(imageData);

              this.account.coverPhotoURL = 'data:image/jpeg;base64,' + imageData;
            });
          }
        }
      ]
    }).present();
  }

  signOut() {
    this.alertCtrl.create({
      title: 'Sign Out',
      subTitle: 'Would you like to sign out?',
      buttons: [
        {
          text: 'No',
          handler: () => console.log('cancel')
        },
        {
          text: 'Yes',
          handler: () => {
            this.afa.auth.signOut()
            this.afa.auth.currentUser.reload();
            this.navCtrl.setRoot(LoginPage);
            // this.viewCtrl.dismiss();
          }
        }
      ]

    }).present();

  }

  deleteAccount() {

    this.alertCtrl.create({
      title: 'Deleting Account',
      subTitle: 'Do you truly want to delede your account?',
      buttons: [
        {
          text: 'No',
          handler: () => console.log('cancel')
        },
        {
          text: 'Yes',
          handler: () => {
            
            this.afs.collection('accounts')
              .valueChanges().subscribe(data => {                
                data = data.filter((a:any) => a.followers && a.followers[this.account.uid]);                
                data.forEach((acc : any) => {
                  let { followers } = acc;
                  console.log(followers);
                  followers = Object.keys(followers).filter(key => key !== this.account.uid ? followers[key]: null);                  
                  
                  this.afs.doc(`accounts/${acc.uid}`).update({
                    followers
                  })
                });
              });
              this.afs.collection('accounts')
              .valueChanges().subscribe(data => {                
                data = data.filter((a:any) => a.following && a.following[this.account.uid]);                
                data.forEach((acc : any) => {
                  let { following } = acc;
                  console.log(following);
                  following = Object.keys(following).filter(key => key !== this.account.uid?following[key]: null);                  
                  
                  this.afs.doc(`accounts/${acc.uid}`).update({
                    following
                  })
                });
              });
           this.afa.auth.currentUser.delete()
          }
        }
      ]

    }).present();

  }

  changePassword() {
    this.alertCtrl.create({
      title: 'Changing Password',
      inputs: [
        {
          placeholder: "Type your new Password",
          type: 'password',
          name: 'password'
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          handler: () => console.log('cancel')
        },
        {
          text: 'Confirm',
          handler: (data) => {
            this.loadingProvider.show();
            this.afa.auth.currentUser.updatePassword(data.password)
              .then(() => {
                this.toast.create({
                  message: 'Password changed successfully!',
                  duration: 5000
                }).present();
                this.loadingProvider.hide();
              })
              .catch(() => {
                this.toast.create({
                  message: 'It wasn\t possible to change your password!',
                  duration: 5000
                }).present();
                this.loadingProvider.hide();
              })
          }
        }
      ]

    }).present();
  }

  changeEmail() {
    this.alertCtrl.create({
      title: 'Changing Email',
      inputs: [
        {
          placeholder: "Type your new Email",
          type: 'text',
          name: 'email'
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          handler: () => console.log('cancel')
        },
        {
          text: 'Confirm',
          handler: (data) => {
            this.loadingProvider.show();
            this.accountProvider.updateAccount(this.account)
              .then(() => {
                this.afa.auth.currentUser.updateEmail(data.email)
                  .then(() => {
                    this.toast.create({
                      message: 'Email changed successfully!',
                      duration: 5000
                    }).present();
                    this.loadingProvider.hide();
                  })
                  .catch(() => {
                    this.toast.create({
                      message: 'It wasn\t possible to change your Email!',
                      duration: 5000
                    }).present();
                    this.loadingProvider.hide();
                  })
              })
              .catch(() => this.loadingProvider.hide());

          }
        }
      ]

    }).present();
  }

  save() {
    this.loadingProvider.show();
    this.account.username.replace(/\s/g, '');
    this.accountProvider.updateAccount(this.account)
      .then(() => this.loadingProvider.hide())
      .catch((err) => {
        console.log(err);
        this.loadingProvider.hide()
      });
  }
}
