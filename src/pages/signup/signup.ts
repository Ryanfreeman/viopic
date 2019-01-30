import { Component, NgZone } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AuthProvider } from '../../providers/auth/auth';
import {countries} from '../../util/countries';

const avatar = 'assets/imgs/buddy.png';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  date = new Date();
  data: any = {
    name: '',
    username: '',
    email: '',
    phone: '',    
    photo: null,
    password: '',
    password2: '',
    birthday: this.date.getFullYear() + '-' +(this.date.getMonth() + 1) + '-' + this.date.getDate() 
  }

  image: any = avatar;  

  step: number = 1;
  countries: any = countries;
  countryCode: any = '+55';
  private showAlert = false;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    private alertCtrl : AlertController,
    private camera: Camera,
    private zone : NgZone
  ) {
    console.log(this.data.birthday);
    
  }

  isValid(): boolean {
    const res = (this.data.name !== '' &&
      ((this.data.email !== '' && this.data.password !== '' &&
        (this.data.password === this.data.password2)) ||
        this.data.phone !== ''));
    return res;

  }

  createAccount() {
    const user: any = this.data;
    this.showAlert = true;
    user.phone = this.countryCode + user.phone;
    user.photoURL = this.image;
    if (this.data.email.trim() === '') {
      console.log('?');
      (<any>window).FirebasePlugin.verifyPhoneNumber(user.phone, 60, (credential) => {
        console.log(credential);
        // ask user to input verificationCode:
        const { verificationId } = credential;
        let prompt = this.alertCtrl.create({
          title: 'Enter the Confirmation code',
          inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Send',
              handler: data => {
                this.authProvider.signUpWithPhoneNumber({
                  verificationId, 
                  confirmationCode: data.confirmationCode,
                  ...user});                
                               
              }
            }
          ]
        });
        if(this.showAlert)
          prompt.present().then(() => this.showAlert = false);
      }, function (error) {
        console.error(error);
      });

      this.authProvider.signUpWithPhoneNumber(user);
    } else {
      this.authProvider.signUpWithEmailAndPassword(user);
    }
  }

  choosePhoto(){
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
              
              this.image = 'data:image/jpeg;base64,' +imageData;
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
              
              this.image = 'data:image/jpeg;base64,' +imageData;
            });            
          }
        }
      ]
    }).present();
  }



  ionViewDidLoad() {

  }

}
