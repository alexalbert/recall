import {AuthService} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

@inject(AuthService, HttpClient )
export class Profile{

	constructor(auth, http){
    // http.configure(config => {
    //   config
    //     .useStandardConfiguration()
    //     .withBaseUrl('http://localhost:8000/auth/me');
    // });

		this.auth = auth;
    this.http = http;
	};

  activate(){
    console.log(localStorage.aurelia_token);
    return this.http.createRequest('http://localhost:8000/auth/me')
    .asGet()
    .withHeader('Authorization', 'Bearer ' + localStorage.aurelia_token).send()
    	.then(data=>{
  			this.profile = JSON.parse(data.response);
  		});
   }



	// activate(){
	// 	return this.auth.getMe()
	// 	.then(data=>{
	// 		this.profile = data;
	// 	});
	// }
	heading = 'Profile';

	link(provider){
		return this.auth.authenticate(provider, true, null)
		/*.then((response)=>{
			console.log("auth response " + response);
			return this.auth.getMe();
		})*/
		.then(()=> this.auth.getMe())
		.then(data=>{
			this.profile = data;
		});;
	}
	unlink(provider){
		return this.auth.unlink(provider)
		/*.then((response)=>{
			console.log("auth response " + response);
			return this.auth.getMe();
		})*/
		.then(()=> this.auth.getMe())
		.then(data=>{
			this.profile = data;
		});;
	}
	email='';
	password='';

}
