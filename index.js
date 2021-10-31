const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//MidleWare

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.corkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect()
        const database = client.db('world_travel');
        const travelCollection = database.collection('travelDb');
        const orderCollection = database.collection('order')
        const bookingCollection = database.collection('addBookings')
        const clientCollection = database.collection('clients')

        //get data
        app.get('/travels', async (req, res) => {
            const cursor = travelCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        })

        // get client 
        app.get('/clients', async (req, res) => {
            const cursor = clientCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        })

        app.get('/travels/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await travelCollection.findOne(query)
            res.json(service);
        });
        //single item post
        app.post('/booking', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })
        app.get('/booking', async (req, res) => {
            const cursor = orderCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
        })

        // post add bookings

        app.post('/addBookings', async (req, res) => {
            const service = req.body;
            const result = await bookingCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })

        // get add booking

        app.get('/addBookings', async (req, res) => {
            const cursor = bookingCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //DElete item

        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running travel server')
})

app.listen(port, () => {
    console.log('server running on port', port)
})