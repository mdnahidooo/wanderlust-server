const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;


// middleware
app.use(cors());
app.use(express.json());




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();

        const db = client.db("wanderlust");
        const destinationCollection = db.collection("destinations");


        app.get('/destination', async (req, res) => {
            const result = await destinationCollection.find().toArray();
            res.send(result);
        });

        app.get('/destination/:id', async (req, res) => {
            const { id } = req.params;
            const result = await destinationCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });


        app.post('/destination', async (req, res) => {
            const destinationData = req.body;
            console.log(destinationData);
            const result = await destinationCollection.insertOne(destinationData);

            res.send(result);
        })


        app.patch('/destination/:id', async (req, res) => {
            const { id } = req.params;
            const updateData = req.body;
            console.log(updateData);

            const result = await destinationCollection.updateOne(
                { _id: new ObjectId(id) }, // eta diye data fibd kori, kon data update korbo
                { $set: updateData }   // eta diye data ta ke update kori
            );
            res.send(result);
        });


        app.delete('/destination/:id', async (req, res) => {
            const { id } = req.params;
            const result = await destinationCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World! My server is running...')
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})