import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {HttpService} from '../../services/http.service';
import {IContent} from '../../models/entities';

@Component({
  selector: 'app-content',
  templateUrl: './content.page.html',
  styleUrls: ['./content.page.scss'],
})
export class ContentPage implements OnInit {

  contents : IContent[] = []
  id_client:string;
  id_beacon:string;
  markdown : string;
  index:number = 0



  constructor(
    private httpService : HttpService,
    private route: ActivatedRoute,
  ) { 
    this.id_client = this.route.snapshot.queryParams["id_client"];
    this.id_beacon = this.route.snapshot.queryParams["id_beacon"];
  }

  ngOnInit() {
    this.httpService.getContents(this.id_client,this.id_beacon)
    .subscribe(contents =>{
      this.contents = contents.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1)
      this.markdown = this.contents[this.index].content
    })
  }

  handleContent(){
    if(this.index<this.contents.length){
      this.index ++
      this.markdown = this.contents[this.index].content
    }
  }

  getDate() : string {
    if(this.contents.length>0){
      let date = new Date(this.contents[this.index].timestamp)
      return date.toLocaleDateString("fr-FR")
    }else return ""
  }

}
