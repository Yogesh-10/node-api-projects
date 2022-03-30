const http = require('http');
const {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} = require('./controllers/productController');

//http.createServer kickstarts the server and socket (port) for sending http msg from client to server,
//when we hit the server we get access to req and res objects

const server = http.createServer((req, res) => {
	if (req.url === '/api/products' && req.method === 'GET') {
		getProducts(req, res);
	} else if (req.url.match(/\/api\/products\/\w+/) && req.method === 'GET') {
		const id = req.url.split('/')[3]; //['', 'api', 'products', '1']
		getProduct(req, res, id);
	} else if (req.url === '/api/products' && req.method === 'POST') {
		createProduct(req, res);
	} else if (req.url.match(/\/api\/products\/\w+/) && req.method === 'PUT') {
		const id = req.url.split('/')[3]; //['', 'api', 'products', '1']
		updateProduct(req, res, id);
	} else if (req.url.match(/\/api\/products\/\w+/) && req.method === 'DELETE') {
		const id = req.url.split('/')[3];
		deleteProduct(req, res, id);
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: 'Route Not Found' }));
	}
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`server running on port ${port}`));
