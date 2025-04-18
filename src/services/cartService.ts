import cartModel from "../models/cartModel";

interface createCart {
    userId: string;
}
const createCart = async ({ userId }: createCart) => {
    const cart = await cartModel.create({ userId, totalPrice: 0 });
    await cart.save();
    return cart;
}

interface getActiveCart {
    userId: string;
}
export const getActiveCart = async ({ userId }: getActiveCart) => {
    let cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart) {
        cart = await createCart({ userId });
    }
    return cart;
}