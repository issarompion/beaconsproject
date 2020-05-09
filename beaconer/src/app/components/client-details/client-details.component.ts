import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import {IClient} from '../../models/interfaces';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit {

  @Input() id_client:string;
  client: IClient = {};
  done : boolean = false
  constructor(
    private http : HttpService,
  ) {
   }

  ngOnInit() {
    this.http.getClient(this.id_client)
    .subscribe(client =>{
       this.client = client
       this.done = true
    })
  }

}
