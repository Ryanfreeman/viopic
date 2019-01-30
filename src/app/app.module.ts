import { Pro } from '@ionic-native/pro';
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// import { SearchPage } from '../pages/search/search';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { VerifyAccountPage } from '../pages/verify-account/verify-account';
import { RecoverAccountPage } from '../pages/recover-account/recover-account';
import { FollowListPage } from '../pages/follow-list/follow-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MediaCapture } from '@ionic-native/media-capture';
import { Base64 } from '@ionic-native/base64';
import { FilePath } from '@ionic-native/file-path';

//config
import firebaseConfig from './firebaseConfig';
//AngularFire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AccountProvider } from '../providers/account/account';
import { AuthProvider } from '../providers/auth/auth';
import { LoadingProvider } from '../providers/loading/loading';
import { ImageProvider } from '../providers/image/image';

import { CDVPhotoLibraryPipe } from '../util/cdvphotolibrary.pipe';
import { TimelineProvider } from '../providers/timeline/timeline';
import { LocationProvider } from '../providers/location/location';
import { ComponentsModule } from '../components/components.module';
import { ChatProvider } from '../providers/chat/chat';
import { TabsProvider } from '../providers/tabs/tabs';



@NgModule({
  declarations: [
    MyApp,
    // SearchPage,
    HomePage,
    LoginPage,
    SignupPage,
    VerifyAccountPage,
    TabsPage,
    RecoverAccountPage,
    FollowListPage,
    CDVPhotoLibraryPipe
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // SearchPage,
    HomePage,
    LoginPage,
    SignupPage,
    VerifyAccountPage,
    RecoverAccountPage,
    FollowListPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AccountProvider,
    AuthProvider,
    LoadingProvider,
    ImageProvider,
    Camera,
    TimelineProvider,
    LocationProvider,
    ChatProvider,
    TabsProvider,
    InAppBrowser,
    MediaCapture,
    Base64,
    FilePath
  ]
})
export class AppModule { }
