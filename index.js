const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "mongodb+srv://jorgeliusps:69PKgdm6@cluster0.wqmkdbz.mongodb.net/?retryWrites=true&w=majority&appName=Hackaton";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

async function main() {
  try {
    await client.connect();
    const database = client.db('Productos');
    const productsCollection = database.collection('Hackaton');
    const usersCollection = database.collection('Users');
    const cartCollection = database.collection('Cart');

    // const products = await productsCollection.find({}).toArray();
    // console.table(products);
    console.log("Connected to MongoDB!");

    app.post('/updatecart', async (req, res) => {
      console.log(req.body);
      try {
        const options = { upsert: true };
        const filter = { userid: req.body.userid };
        const updateDoc = {
          $set: {
            userid: req.body.userid,
            products: req.body.products,
          },
        };
        const result = await cartCollection.updateOne(filter, updateDoc, options);
        if (result) {
          res.json({
            success: true,
            message: "Updated cart!",
            cart: result,
          });
        }
        else {
          res.json("Failed to update cart");
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.post('/signup', async (req, res) => {
      console.log(req.body);
      try {
        const user = await usersCollection.findOne({ user: req.body.user });
        console.log(user);
        if (user) {
          res.json({
            success: false,
            message: "User Already exists",
            user: user,
          });
        }
        else {
          const doc = { user: req.body.user, password: req.body.password };
          const result = await usersCollection.insertOne(doc);
          res.json({
            success: true,
            message: "User Created Successfully",
            user: result,
            cart: undefined
          });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    app.post('/login', async (req, res) => {
      console.log(req.body);
      try {
        const user = await usersCollection.findOne({ user: req.body.user, password: req.body.password });
        console.log(user);
        if (user) {
          // const cart = await cartCollection.findOne({ userid: JSON.stringify(user._id) });
          const carts = await cartCollection.find({}).toArray();
          const cart = carts.filter(function (temp) {
            return JSON.stringify(temp["userid"]) == JSON.stringify(user._id)
          })[0]
          res.json({
            success: true,
            message: "Success!",
            user: user,
            cart: cart
          });
        }
        else {
          res.json("Invalid User/Password!");
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    // Ruta para la página de inicio (listado de productos)
    app.get('/api/products', async (req, res) => {
      console.log("/api/products is being called, yay!");
      console.log(req.body);
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
