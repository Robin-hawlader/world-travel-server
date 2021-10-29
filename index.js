const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
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
        console.log('connected server')
        const database = client.db('world_travel');
        const travelCollection = database.collection('travelDb');

        //get data
        app.get('/travels', async (req, res) => {
            const cursor = travelCollection.find({});
            const travels = await cursor.toArray();
            res.send(travels);
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