import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';
import {
  AuthorizeStep
}
from 'paulvanbladel/aurelia-auth';
import {
  Router
}
from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config, router) {
    config.title = 'Total Recall';

    config.addPipelineStep('authorize', AuthorizeStep);

    config.map([{
      route: ['', 'notes'],
      name: 'notes',
      moduleId: './notes',
      nav: true,
      title: 'Notes',
      auth: true
    }, {
      route: 'login',
      name: 'login',
      moduleId: './login',
      nav: true,
      title: 'Login'
    }, {
      route: 'profile',
      name: 'profile',
      moduleId: './profile',
      nav: true,
      title: 'Profile',
      auth: true
    }, ]);

    this.router = router;
  }
}
