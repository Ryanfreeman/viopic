import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RecoverAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recover-account',
  templateUrl: 'recover-account.html',
  providers: [AuthProvider]
})
export class RecoverAccountPage {

  email: string = '';
  error: string = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider : AuthProvider,
    public toast : ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoverAccountPage');
  }

  sendEmail() {
    if (!this.email.includes('@') || !this.email.includes('.')){
      this.error = 'Email badly formatted!';
    } else {
      this.authProvider.resetPassword(this.email)
        .then(() => {
          this.toast.create({
            message: 'A reset password link was sent to ' + this.email,
            duration: 5000
          }).present().then(() => this.navCtrl.pop());          
        })
        .catch(err => {
          this.toast.create({
            message: err.message,
            duration: 5000
          }).present();
        }); 

    }

  }

}
