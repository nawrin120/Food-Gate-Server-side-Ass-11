const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express();
const port = process.env.PORT || 7000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhv3e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected')

        const database = client.db('Food-gate');
        const itemsCollection = database.collection('items')
        const orderCollection = database.collection('orders')
        // GET API
        app.get('/items', async (req, res) => {
            const cursor = itemsCollection.find({})
            const services = await cursor.toArray()

            res.send(services)
        })
        // GET API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const services = await cursor.toArray()

            res.send(services)
        })

        // POST API
        app.post('/items', async (req, res) => {
            const service = req.body
            const result = await itemsCollection.insertOne(service)
            res.json(result)
        });

        // GET API BY ID
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const service = await itemsCollection.findOne(qurey)
            res.json(service)
        })
        // GET API BY ID
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const order = await orderCollection.findOne(qurey)
            res.json(order)
        })

        // POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);


            res.json(result)


        })
        //  DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(qurey)
            res.json(result)
        })

    }
    finally {
        //  await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Port : ', port)
})


