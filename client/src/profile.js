import {AuthService} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';

@inject(AuthService)
export class Profile{

	heading = 'Profile';

	constructor(auth){
		this.auth = auth;
		this.profile = null;
	};

  activate(){
		return this.auth.getMe()
			.then(data=>{
				this.profile = data;
			});
  }

	link(provider){
		return this.auth.authenticate(provider, true, null)
		.then(()=> this.auth.getMe())
		.then(data=>{
			this.profile = data;
		});;
	}

	unlink(provider){
		return this.auth.unlink(provider)
		.then(()=> this.auth.getMe())
		.then(data=>{
			this.profile = data;
		});;
	}

	logout() {
			return this.auth.logout("/")
			/*.then((response)=>{
				console.log("auth response " + response);
				return this.auth.getMe();
			})*/
			.then(() => {
				this.profile = undefined;
			});;
		}

	email='';
	password='';

}
