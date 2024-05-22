const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "mongodb+srv://jorgeliusps:69PKgdm6@cluster0.wqmkdbz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());

async function main() {
  try {
    await client.connect();
    const database = client.db('test');
    const productsCollection = database.collection('products');
    
    console.log("Connected to MongoDB!");

    // Ruta para la página de inicio (listado de productos)
    app.get('/api/products', async (req, res) => {
      try {
        const products = await productsCollection.find({}).toArray();
        res.json(products);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Ruta para filtros de búsqueda
    app.get('/api/products/search', async (req, res) => {
      const { category, minPrice, maxPrice } = req.query;
      let query = {};

      if (category) query.category = category;
      if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
      if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };

      try {
        const products = await productsCollection.find(query).toArray();
        res.json(products);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

main().catch(console.dir);
