import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

@Injectable()
export class LocationProvider {

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder

  ) {
    
  }


  getLocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition(
        { timeout: 10000, enableHighAccuracy: true }
      )
        .then(position => {
          console.log('position', position);          
          const res = { lat: position.coords.latitude, long: position.coords.longitude };
          resolve(res);
        })
        .catch(err => console.log(err));
    });
  }

  getAddress(location) {
    return new Promise((resolve) => {
      this.nativeGeocoder.reverseGeocode(location.lat, location.long)
        .then((result) => {
          console.log(JSON.stringify(result));
          resolve(result[0]);
        }).catch((error: any) => console.log(error));
    });
  }

}
