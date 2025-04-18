import cartModel from "../models/cartModel";
import productModel from "../models/productModel";

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

interface AddItemToCart {
    userId: string;
    productId: any;
    quantity: number;
}


export const addItemToCart = async ({ productId, quantity, userId }: AddItemToCart) => {
    const cart = await getActiveCart({ userId });

    const exisitsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (exisitsInCart) {
        return { data: "Product already exists in cart", statusCode: 400 };
    }
    const product = await productModel.findById(productId);
    if (!product) {
        return { data: "Product not found", statusCode: 400 };
    }
    if (product.stock < quantity) {
        return { data: "Not enough stock", statusCode: 400 };
    }
    cart.items.push({
        product: productId,
        unitPrice: product.price,
        quantity,
    });

    cart.totalPrice += product.price * quantity;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
}

interface UpdateItemInCart {
    userId: string;
    productId: any;
    quantity: number;
}
export const updateItemInCart = async ({ productId, quantity, userId }: UpdateItemInCart) => {
    const cart = await getActiveCart({ userId });

    const exisitsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (!exisitsInCart) {
        return { data: "Product not found in cart", statusCode: 400 };
    }

    const product = await productModel.findById(productId);
    if (!product) {
        return { data: "Product not found", statusCode: 400 };
    }
    if (product.stock < quantity) {
        return { data: "Not enough stock", statusCode: 400 };
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    let total = otherCartItems.reduce((sum, product) => {
        sum += product.quantity * product.unitPrice;
        return sum;
    }, 0)
    exisitsInCart.quantity = quantity;

    total += exisitsInCart.quantity * exisitsInCart.unitPrice;
    cart.totalPrice = total;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };

}