import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
  	private router: Router,
  	private flashMessage: FlashMessagesService,
  	private authService: AuthService
  	) { }

  ngOnInit() {
  }

  onLogoutClick() {
  	this.authService.logout();
  	this.flashMessage.show('You are logged out.', {cssClass: 'alert-success', timeout: 3000});
  	this.router.navigate(['/login']);
  	return false;
  }

}
