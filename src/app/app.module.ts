import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AppComponent } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ExplorePage } from '../pages/explore/explore';
import { CurrentUserService } from '../providers/user/current-user.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LocationService } from '../providers/location/location.service';
import { Geolocation } from '@ionic-native/geolocation';
import { CommonModule } from '@angular/common';
import { ImprintModalComponent } from '../pages/explore/imprint-modal/imprint-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutPage,
    ExplorePage,
    HomePage,
    TabsPage,
    ImprintModalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    LeafletModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    AboutPage,
    ExplorePage,
    HomePage,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CurrentUserService,
    LocationService,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
