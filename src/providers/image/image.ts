import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';


@Injectable()
export class ImageProvider {

  constructor(
    private camera: Camera,
    private ngZone: NgZone,
    private base64: Base64,
    private filePath: FilePath
  ) {
    console.log('Hello ImageProvider Provider');
  }
  profilePhotoOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };

  photoMessageOptions = {
    quality: 50,
    targetWidth: 300,
    targetHeight: 200,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    allowEdit: true,
  };

  groupPhotoOptions = {
    quality: 50,
    targetWidth: 384,
    targetHeight: 384,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
  };


  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  generateVideoName() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".ogg";
  }

  uploadProfilePhoto(uid, imageData) {
    return new Promise((resolve, reject) => {
      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        'contentType': imgBlob.type
      };

      firebase.storage().ref().child('images/' + uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        console.log('Snapshot', snapshot);
        // URL of the uploaded image!
        let url = snapshot.metadata.downloadURLs[0];
        console.log('Photo URL', url);
        resolve(url);
      }).catch((error) => {
        console.log('Error.up', error);
        reject(error);
      });

    });
  }

  uploadPostPhoto(uid, imageData) {
    return new Promise((resolve, reject) => {
      console.log(imageData);
      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        'contentType': imgBlob.type
      };

      firebase.storage().ref().child('images/posts/' + uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        console.log('Snapshot', snapshot);
        // URL of the uploaded image!
        let url = snapshot.metadata.downloadURLs[0];
        console.log('Photo URL', url);
        resolve(url);
      }).catch((error) => {
        console.log('Error.up', error);
        reject(error);
      });

    });
  }



  uploadPostVideo(uid, videoData) {
    return new Promise((resolve, reject) => {
      console.log('file://'+videoData);
      this.filePath.resolveNativePath('file://'+videoData).then(file => {
        console.log(file);
        console.log(new Date().toString());
        this.base64.encodeFile(file).then((base64File: string) => {
          let videoBlob = this.imgURItoBlob(base64File);
          let metadata = {
            'contentType': "video/ogg"
          };

          firebase.storage().ref().child('videos/posts/' + uid + '/' + this.generateVideoName()).put(videoBlob, metadata).then((snapshot) => {
            // Delete previous profile photo on Storage if it exists.
            console.log('Snapshot', snapshot);
            console.log(new Date().toString());
            // URL of the uploaded image!
            let url = snapshot.metadata.downloadURLs[0];
            console.log('Video URL', url);
            resolve(url);
          }).catch((error) => {
            console.log('Error.up', error);
            reject(error);
          });
        });
      }).catch(error => console.log('Unable to resolve file:' + error));
    });
  }

  uploadCoverPhoto(uid, imageData) {
    return new Promise((resolve, reject) => {
      let imgBlob = this.imgURItoBlob(imageData);
      let metadata = {
        'contentType': imgBlob.type
      };

      firebase.storage().ref().child('images/cover/' + uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        // Delete previous profile photo on Storage if it exists.
        console.log('Snapshot', snapshot);
        // URL of the uploaded image!
        let url = snapshot.metadata.downloadURLs[0];
        console.log('Photo URL', url);
        resolve(url);
      }).catch((error) => {
        console.log('Error.up', error);
        reject(error);
      });

    });
  }


}
