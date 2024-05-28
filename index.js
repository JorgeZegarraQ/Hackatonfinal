const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Rutas
// const cartRoutes = require('./routes/cart.routes');
// const couponRoutes = require('./routes/coupon.routes');
// const paymentRoutes = require('./routes/payment.routes');
const productsRoutes = require('./routes/products.routes');
// const transactionsRoutes = require('./routes/transactions.routes');
const usersRoutes = require('./routes/users.routes');
// app.use('/api/cart', cartRoutes);
// app.use('/api/coupon', couponRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/products', productsRoutes);
// app.use('/api/transactions', transactionsRoutes);
app.use('/api/users', usersRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});