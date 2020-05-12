import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import {IClient} from '../../models/entities';
import { MenuController } from '@ionic/angular'

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {

  clients: IClient[];

  constructor(
    private http : HttpService,
    public menuCtrl : MenuController,
  ) { }

  ngOnInit() {
    this.http.getClients()
    .subscribe(clients =>{
       this.clients = clients
    })
  }

  enableMenu() {
    this.menuCtrl.enable(true);
  }

}
