var cli = require('aurelia-cli');

var bundleCfg = {
  js: {
    "dist/app-bundle": {
      modules: [
        '*',
        'aurelia-bootstrapper',
        'aurelia-fetch-client',
        'aurelia-router',
        'aurelia-animator-css',
        'github:aurelia/templating-binding',
        'github:aurelia/templating-resources',
        'github:aurelia/templating-router',
        'github:aurelia/loader-default',
        'github:aurelia/history-browser',
        'github:aurelia/html-template-element@0.2.0',
        'github:paulvanbladel/aurelia-auth@0.9.6',
        'github:paulvanbladel/aurelia-auth@0.9.6/authFilter',
        'github:webcomponents/webcomponentsjs@0.6.3/HTMLImports.min',
        'github:aurelia/html-template-element@0.2.0/HTMLTemplateElement.min',
      ],
      options: {
        inject: true
      }
    }
  },
  template: {
    "dist/app-bundle": {
      pattern: 'dist/*.html',
      options: {
        inject: true
      }
    }
  }
};

cli.command('bundle', bundleCfg);
cli.command('unbundle', bundleCfg);
