var SERVER_NAME = 'product-api'
var PORT = 3000;
var HOST = '127.0.0.1';

var sendGetCount = 0;
var sendPostCount = 0;

var restify = require('restify')

  // getting a persistence engine for the products
  , productsSave = require('save')('products')

  // creating the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log(server.url+'/sendGet', 'To fetch all products')
  console.log(server.url+'/sendPost', 'To add product')
  console.log(server.url+'/sendDelete', 'To delete all products')
})

server
  // allowing the use of POST
  .use(restify.fullResponse())

  // maping request.body to request.params so there is no switching between them
  .use(restify.bodyParser())

// method to get all products
server.get('/sendGet', function (request, response, next) {

  sendGetCount++; // increased by every visit to sendGet
  console.log("Processed Request Counts: sendGET: "+sendGetCount+", sendPost: "+sendPostCount);
  // find every entity within the given collection
  productsSave.find({}, function (error, products) {
    // return all of the products in the system
    response.send(products)
  })
})


// method to create a new product
server.post('/sendPost', function (request, response, next) {
  
  sendPostCount++; // // increased by every visit to sendPost
  console.log("Processed Request Counts: sendGET: "+sendGetCount+", sendPost: "+sendPostCount);
  // name is compulsory
  if (request.params.product === undefined ) {
    return next(new restify.InvalidArgumentError('Product must be supplied'))
  }
  // price is compulsory
  if (request.params.price === undefined ) {
    return next(new restify.InvalidArgumentError('Price must be supplied'))
  }

  var newProduct = {
		product: request.params.product, 
		price: request.params.price
	}

  // creating the product using the persistence engine
  productsSave.create( newProduct, function (error, products) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    // send product if no issues
    response.send(201, products)
  })
})

// method to delete all products
server.del('/sendDelete', function (request, response, next) {
  // delete products with the persistence engine
  productsSave.deleteMany({},function (error, products) {
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    // Send a 200 OK response
    response.send(200)
  })
})
