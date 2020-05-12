import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  project_name = environment.project_name

  constructor(
    public menuCtrl : MenuController,
    ) { 
    this.disableMenu()
  }

  ngOnInit() {
  }

  disableMenu() {
    this.menuCtrl.enable(false);
  }

}
