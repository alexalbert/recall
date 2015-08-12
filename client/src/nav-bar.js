import {bindable} from 'aurelia-framework';
import {AuthService} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';
import {ServerApi} from "./server-api"

@inject(AuthService, ServerApi)
export class NavBar {
  @bindable router = null;

  constructor(auth, server) {
    this.auth = auth;
    this.server = server;
    this.userName = undefined;

    if (localStorage.aurelia_token) {
      this.auth.getMe()
        .then(data => {
          this.profile = data;
          this.userName = this.profile.displayName;
        });
     }
  }
}
