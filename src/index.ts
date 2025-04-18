import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import { seedInitialProducts } from './services/productService';


const app = express();
const PORT =  3001;

app.use(express.json());

mongoose
    .connect('mongodb://localhost:27017/ecommerce')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => console.log('Error connecting to MongoDB', err));

seedInitialProducts()

    app.use('/user', userRoute);
    app.use('/product', productRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});