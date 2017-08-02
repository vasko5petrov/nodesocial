import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate{
	constructor(private authService: AuthService, private router: Router) {

	}

	canActivate(path) {
		var route = path.url[0].path;
		if(this.authService.loggedIn() && route == 'profile' || this.authService.loggedIn() && route == 'dashboard') {
			return true;
		} else if(!this.authService.loggedIn() && route == 'login' || !this.authService.loggedIn() && route == 'register') {
			return true;
		} else if(this.authService.loggedIn() && route == 'login' || this.authService.loggedIn() && route == 'register') {
			this.router.navigate(['/dashboard']);
			return false;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}

}