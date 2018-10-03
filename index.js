var SERVER_NAME = 'product-api'
var PORT = 2000;
var HOST = '127.0.0.1';

var sendGetReq = 0;
var sendPostReq = 0;

var restify = require('restify')

  // Get a persistence engine for the users
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Endpoints:')
  console.log(server.url+'/sendGet', 'To fetch all products')
  console.log(server.url+'/sendPost', 'To add product')
  console.log(server.url+'/sendDelete', 'To delete all products')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/sendGet', function (req, res, next) {
    sendGetReq++;
  // find every entity within the given collection
  productsSave.find({}, function (error, products) {
    // return all of the products in the system
    res.send(products)
  })
  console.log("Processed Request Count --> sendGet: %s | sendPost %s", sendGetReq, sentPostReq);
})


// create a new product
server.post('/sendPost', function (req, res, next) {

    sendPostReq++;
  // make sure name is defined
  if (req.params.name === undefined ) {
    console.log("Processed Request Count --> sendGet: %s | sendPost %s", sendGetReq, sentPostReq);
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.price === undefined ) {
    console.log("Processed Request Count --> sendGet: %s | sendPost %s", sendGetReq, sentPostReq);
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  var newProduct = {
		name: req.params.name, 
		price: req.params.price
	}

  // create the product using the persistence engine
  productsSave.create( newProduct, function (error, products) {
    console.log("Processed Request Count --> sendGet: %s | sendPost %s", sendGetReq, sentPostReq);
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // send product if no issues
    res.send(201, products)
  })
})

// delete all products
server.del('/sendDelete', function (req, res, next) {
  // delete products with the persistence engine
  productsSave.deleteMany({},function (error, products) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    // Send a 200 OK response
    res.send(200)
  })
})
