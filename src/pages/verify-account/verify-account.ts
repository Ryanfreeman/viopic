import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { TabsPage } from '../../pages/tabs/tabs';
import { LoadingProvider } from '../../providers/loading/loading';

@Component({
  selector: 'page-verify-account',
  templateUrl: 'verify-account.html',
})
export class VerifyAccountPage {

  message: string = '';
  user: any;
  authProvider: any;
  private checkVerified;
  private emailVerified;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afa: AngularFireAuth,
    private afs: AngularFirestore,
    private alertCtrl: AlertController,
    private loadingProvider: LoadingProvider,
    private toast: ToastController
  ) {
    const { uid, email } = this.navParams.get('user');

    this.user = { uid, email };

  }

  ionViewDidLoad() {
    var that = this;
    if (that.afa.auth.currentUser) {
      that.checkVerified = setInterval(() => {
        that.afa.auth.currentUser.reload();
        if (that.afa.auth.currentUser.emailVerified) {
          clearInterval(that.checkVerified);
          that.emailVerified = true;
          that.navCtrl.setRoot(TabsPage);

        }
      }, 1000);
    }
  }

  sendEmailVerification() {
    this.afa.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.message = "Email verification sent!";
      });
  }

  setEmail() {
    let alert = this.alertCtrl.create({
      title: 'Change Email Address',
      message: "Please enter a new email address.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Your Email Address',
          value: this.user.email
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let email = data["email"];
            // Check if entered email is different from the current email
            if (email !== this.user.email) {
              this.loadingProvider.show();
              // Update email on Firebase
              this.afa.auth.currentUser.updateEmail(email)
                .then((res) => {
                  //Update UserData
                  this.afa.auth.currentUser.sendEmailVerification();
                  this.afs.collection('accounts').doc(this.user.uid).update({ email: email });
                  this.ionViewDidLoad();
                  this.loadingProvider.hide();
                  this.toast.create({
                    message: 'Email changed successfully',
                    duration: 5000
                  }).present();
                })
                .catch((err) => {
                  this.loadingProvider.hide();
                  this.toast.create({
                    message: 'Invelid Email',
                    duration: 5000
                  }).present();
                });
            }
          }



        }
      ]
    }).present();

  }

  logout() {
    this.afa.auth.signOut();
    this.navCtrl.popToRoot();
  }

  emailVerification() {

  }

}
