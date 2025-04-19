import { get } from "mongoose";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
    const products = await productModel.find();
    return { data: products, statusCode: 200 };
}

export const seedInitialProducts = async () => {
    try {
        const initialProducts = [
            { title: "Dell Laptop", image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftv-it.com%2Fproduct-categories%2Fdell-laptops&psig=AOvVaw2wAR11r6ThRRWRYPPtL64G&ust=1745071496655000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjIoofg4YwDFQAAAAAdAAAAABAE", price: 44500, stock: 5 },
        ];

        const existingProducts = await getAllProducts();
        if (existingProducts.data.length === 0) {
            await productModel.insertMany(initialProducts);
            return { data: "Initial products seeded", statusCode: 201 };
        }
    } catch (err) {
        console.error(err);
        return { data: "Error seeding initial products", err};
    }

}