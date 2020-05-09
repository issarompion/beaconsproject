import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { IUser } from '../../models/interfaces';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  users: IUser[];

  constructor(private userService: UserService) { }

  ngOnInit() {
      this.loading = true;
      this.userService.getAll().pipe(first()).subscribe(data => {
          this.loading = false;
          this.users = data.value;
      });
  }

}
