const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});
//ping
client.ping({
     requestTimeout: 30000,
 }, function(error) {
 
     if (error) {
         console.error('Elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });


 create a new index called products
client.indices.create({
    index: 'products'
}, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});



const products = require('./products.json');
// declare an empty array called bulk
console.log(products)
var bulk = [];

products.forEach(product =>{
   bulk.push({index:{ 
                 _index:"products", 
                 _type:"products_list",

                 
             }          
         })
  bulk.push(product)
//   console.log(product)
//   console.log(bulk)
})



//perform bulk indexing of the data passed to push all the objects
client.bulk({body:bulk}, function( err, response  ){ 
         if( err ){ 
             console.log("Failed Bulk operation".red, err) 
         } else { 
             console.log("Successfully imported %s", products.length); 
         } 
}); 

