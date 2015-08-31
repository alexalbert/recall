import {inject} from 'aurelia-framework';
import {AuthService} from 'paulvanbladel/aurelia-auth';
@inject(AuthService)

export class Signup{
	constructor( auth){
		this.auth = auth;
	}
	heading = 'Sign Up';

	email='';
	password='';
	displayName='';
  message = '';

	signup(){
		return this.auth.signup(this.displayName, this.email, this.password)
		.then(out =>{
      console.log(out.response);
		},
    out => {
      this.message = out.response;
      console.log(out.response);
    });

	}
}
