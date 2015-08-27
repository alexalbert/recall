import {AuthorizeStep} from 'paulvanbladel/aurelia-auth';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export default class{

	constructor(router){
		this.router = router;
	}
	configure(){
		var appRouterConfig = function(config){
			config.title = 'Total Recall';
			config.addPipelineStep('authorize', AuthorizeStep); // Add a route filter to the authorize extensibility point.

      config.map([{
        route: ['', 'notes'],
        name: 'notes',
        moduleId: './notes',
        nav: false,
        title: 'Notes',
        auth: true
			}, {
        route: 'login',
        name: 'login',
        moduleId: './login',
        nav: false,
        title: 'Login'
			}, {
        route: 'signup',
        name: 'signup',
        moduleId: './signup',
        nav: false,
        title: 'Signup'
      }, {
        route: 'profile',
        name: 'profile',
        moduleId: './profile',
        nav: false,
        title: 'Profile',
        auth: true
      }, ]);
    };

		this.router.configure(appRouterConfig);
	}
}
