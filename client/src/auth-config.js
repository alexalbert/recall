var configForDevelopment = {
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
    providers: {
        google: {
            clientId: '239531826023-3ludu3934rmcra3oqscc1gid3l9o497i.apps.googleusercontent.com'
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