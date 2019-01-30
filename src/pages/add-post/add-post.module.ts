import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostPage } from './add-post';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationProvider } from '../../providers/location/location';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPostPage),
  ],
  providers: [LocationProvider, NativeGeocoder, Geolocation]
})
export class AddPostPageModule {}
