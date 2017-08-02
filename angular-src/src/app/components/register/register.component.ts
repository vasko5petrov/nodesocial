import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	name: String;
	email: String;
	username: String;
	password: String;

  constructor(
  	private validateService: ValidateService,
  	private flashMessage: FlashMessagesService,
    private authService: AuthService,
  	private router: Router
  	) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
  	const user = {
  		name: this.name,
  		email: this.email,
  		username: this.username,
  		password: this.password
  	}

  	if(!this.validateService.validateRegister(user)) {
  		this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
  		return false;
  	}

  	if(!this.validateService.validateEmail(user.email)) {
  		this.flashMessage.show('Please provide a valid email', {cssClass: 'alert-danger', timeout: 3000});
  		return false;
  	}

    this.authService.registerUser(user).subscribe(data => {
      if(data.success) {
        this.flashMessage.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    });
  }

}
