import { NgModule,Provider  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';

import { FakeBackendInterceptor } from './helpers/fake-bakend'

let isDev : boolean = !environment.production

const mockProviders : Provider[] = [
  {  provide: HTTP_INTERCEPTORS,useClass: FakeBackendInterceptor,multi: true }
]

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // provider used to create fake backend
    isDev ? mockProviders : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
