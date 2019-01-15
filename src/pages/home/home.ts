import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CurrentUserService } from '../../providers/user/current-user.service';
import { UserProfile } from '../../providers/models/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public currentUser: UserProfile;
  constructor(public navCtrl: NavController,
              private currentUserService: CurrentUserService) {
  }

  ngOnInit(){
    this.currentUser = this.currentUserService.getCurrentUser();
  }

}
