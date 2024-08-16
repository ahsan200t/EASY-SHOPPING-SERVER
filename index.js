const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5000',
      'http://localhost:5174',
      
  
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }

app.use(express.json());
app.use(cors(corsOptions));



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ouoa8yh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const productCollection = client.db('productsDb').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size)
            const result = await productCollection.find()
            .skip(page * size)
            .limit(size)
            .toArray();
            res.send(result)
          })

          app.get('/productsCount', async(req,res)=>{
            const count = await productCollection.estimatedDocumentCount();
            res.send({count})
          })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("server is running")
});

app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})