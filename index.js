

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});
//require Express
const express = require( 'express' );
// instanciate an instance of express and hold the value in a constant called app
const app     = express();


const bodyParser = require('body-parser')
//require the path library
const path    = require( 'path' );

// ping the client to be sure Elasticsearch is up
client.ping({
     requestTimeout: 30000,
 }, function(error) {
 // at this point, eastic search is down, please check your Elasticsearch service
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });


// use the bodyparser as a middleware  
app.use(bodyParser.json())
// set port for the app to listen on
app.set( 'port', process.env.PORT || 3001 );
// set path to serve static files
app.use( express.static( path.join( __dirname, 'public' )));
// enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function(req, res){
  res.sendFile('index.html', {
     root: path.join( __dirname, 'views' )
   });
})

// define the /search route that should return elastic search results 
app.get('/search', function (req, res){
  
  let body = {
    size: 10,
    from: 0, 
    query: {
      match: {
          name: req.query['q']
      }
    }
  }
  // perform the actual search passing in the index, the search query and the type
  client.search({index:'products',  body:body, type:'products_list'})
  .then(results => {
     // console.log("results im index.js",results);
    res.send(results.hits.hits);

    
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

})

app .listen( app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
} );