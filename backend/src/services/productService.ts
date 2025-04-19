import { get } from "mongoose";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
    const products = await productModel.find();
    return { data: products, statusCode: 200 };
}

export const seedInitialProducts = async () => {
    try {
        const initialProducts = [
            {
                title: "Dell Inspiron 15 3511",
                image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/inspiron-15-3511/pdp/notebook-inspiron-15-3511-pdp-mod01.jpg?fmt=jpg&wid=965&hei=570&qlt=100%2C0",
                price: 44500,
                stock: 5,
            },
            {
                title: "HP Pavilion x360",
                image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06618582.png",
                price: 48000,
                stock: 3,
            },
            {
                title: "Lenovo IdeaPad 3 i3 11th Gen",
                image: "https://p4-ofp.static.pub/fes/cms/2022/09/26/h4cqq9fbpmoy1moop8u2nywhmn8qio861031.jpg",
                price: 33000,
                stock: 6,
            },
            {
                title: "Apple MacBook Air M1 13",
                image: "https://accenthub.com.ph/wp-content/uploads/2022/02/Apple-MacBook-Air-2020-MGND3PP_A-13.3-Inches-Laptop-Gold-1.jpg",
                price: 59999,
                stock: 2,
            },
            {
                title: "Asus TUF Gaming F15",
                image: "https://www.ubuy.com.eg/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvODFNam1QdU9yMkwuX0FDX1NMMTUwMF8uanBn.jpg",
                price: 67500,
                stock: 4,
            },
            {
                title: "MSI GF63 Thin 11SC",
                image: "https://m.media-amazon.com/images/I/71BCum1YVzL._AC_SL1500_.jpg",
                price: 52000,
                stock: 3,
            },
            {
                title: "Acer Aspire 5 A515",
                image: "https://m.media-amazon.com/images/I/71vvXGmdKWL.jpg",
                price: 39500,
                stock: 7,
            },
        ];


        const existingProducts = await getAllProducts();
        if (existingProducts.data.length === 0) {
            await productModel.insertMany(initialProducts);
            return { data: "Initial products seeded", statusCode: 201 };
        }
    } catch (err) {
        console.error(err);
        return { data: "Error seeding initial products", err };
    }

}