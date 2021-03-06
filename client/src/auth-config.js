var configForDevelopment = {
  // httpInterceptor: true,
  // loginOnSignup: true,
  // baseUrl: '/',
  loginRedirect: '/',
  // logoutRedirect: '/',
  // signupRedirect: '/login',
  // loginUrl: '/auth/login',
  // signupUrl: '/auth/signup',
  // profileUrl: '/auth/me',
  // loginRoute: '/login',
  // signupRoute: '/signup',
  // tokenRoot: false,
  // tokenName: 'token',
  // tokenPrefix: 'aurelia',
  // unlinkUrl: '/auth/unlink/',
  // unlinkMethod: 'get',
  // authHeader: 'Authorization',
  // authToken: 'Bearer',
  // withCredentials: true,
  // platform: 'browser',
  // storage: 'localStorage',
    providers: {
        google: {
            clientId: '295614233056-uk5bbi946vqicdj706d6qr7bvee6ve6j.apps.googleusercontent.com'
        }
        ,
        linkedin:{
            clientId:'778mif8zyqbei7'
        },
        facebook:{
            clientId:'1452782111708498'
        }
    }
};

var configForProduction = {
  loginRedirect: '/',
    providers: {
        google: {
          clientId: '295614233056-uk5bbi946vqicdj706d6qr7bvee6ve6j.apps.googleusercontent.com'
        }
        ,
        linkedin:{
            clientId:'7561959vdub4x1'
        },
        facebook:{
            clientId:'1653908914832509'
        }

    }
};
var config : any;

if (window.location.hostname==='localhost') {
    config = configForDevelopment;
}
else{
    config = configForProduction;
}


export default config;
