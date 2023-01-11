const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')

var app = express()
app.use(cors())

const port = 8000;

let fakeDB = {
	flavors: [
		{ name: "vanilla", amount: 2 },
		{ name: "chocolate", amount: 5 },
		{ name: "strawberry", amount: 1 },
		{ name: "mint", amount: 8 },
	],
	customers: [{
		id: 1,
		name: 'John',
		favoriteFlavor: 'vanilla'
	}, {
		id: 2,
		name: 'Jane',
		favoriteFlavor: 'chocolate'
	}, {
		id: 3,
		name: 'Bob',
		favoriteFlavor: 'strawberry'
	}]
}

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next()
});

app.use(bodyParser.json())
app.get('/api/', (req, res) => {
	res.send({ data: 'your server is working (;' })
});
// get all flavors from the fakeDB
app.get('/api/flavor', (req, res) => {
	const { query } = req

	const toGive = query.amount ? fakeDB.flavors.filter(flavor => flavor.amount >= Number(query.amount)) : fakeDB.flavors
	console.log('query: ', query);
	console.log('Number(query.amount): ',query.amount);
	console.log('toGive: ', toGive);
	undefined
	res.json(toGive) //use res.json to return res as json
});

//customers API
app.get('/api/customer/:id', (req, res) => {
	//First Mission: return to client customer from FakeDB - specified by param
	const user = fakeDB.customers.find(customer => customer.id === Number(req.params.id))
	console.log('user: ', user);
	res.json(user)
})

//! Second Mission - (PUT) create a route that handles buying ice cream flavor by name from req.params, 
//!recive flavor from params and amount from body
app.put('/api/flavor/:name', (req, res, next) => {
	const { body, params } = req
	const flavor = fakeDB.flavors.find(flavor => flavor.name === params.name)

	if (body.amount > flavor.amount)
		res.status(404).send("not enough in stock :(")
	else {
		flavor.amount = flavor.amount - body.amount
		res.send(fakeDB.flavors)
	}
})


//! Third Mission - (Post) create a route that handle adding new flavor to the fakeDB. 
//!receive flavors through req.body
app.post('/api/flavor', (req, res, next) => {
	const { body } = req
	fakeDB.flavors = [...fakeDB.flavors, body]
	res.send(fakeDB.flavors)
})

//!Fourth Mission (Get) in the existing route "/api/flavor" add a query of amount. 
//!If amount is given, return only the flavors that has at least that amount

//! Extra Mission - (Delete) create a route that handle deleting flavor from the fakeDB.flavors through req.params

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`)
});
