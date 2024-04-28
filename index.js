const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6qre6yi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotsCollection  = client.db("spotData").collection("spots");


    app.post('/spots', async(req, res) =>{
        const spots = req.body; 
        console.log(spots)
        const result = await  spotsCollection.insertOne(spots);
        res.send(result)
    })

    app.delete('/spots/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id:  new ObjectId(id)};
        const result = await spotsCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/spots', async (req,res)=>{
        const result = await spotsCollection.find().toArray();
        res.send(result)
    })

    app.get('/myList/:email', async(req, res) =>{
        console.log(req.params.email)
        const result = await  spotsCollection.find({email:req.params.email}).toArray();
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', async (req, res) => {
    res.send("Tripify server is running");
});


app.listen(port, () => {
    console.log(`Tripify server is running on port: ${port}`); 
});
