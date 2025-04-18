import cartModel, { ICart, ICartItem } from "../models/cartModel";
import { IOrderItem, OrderModel } from "../models/orderModel";
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

    let total = calculateTotalItems({ cartItems: otherCartItems });

    exisitsInCart.quantity = quantity;

    total += exisitsInCart.quantity * exisitsInCart.unitPrice;
    cart.totalPrice = total;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };

}

interface DeleteItemInCart {
    userId: string;
    productId: any;
}

export const deleteItemInCart = async ({ productId, userId }: DeleteItemInCart) => {
    const cart = await getActiveCart({ userId });

    const exisitsInCart = cart.items.find((p) => p.product.toString() === productId);
    if (!exisitsInCart) {
        return { data: "Product not found in cart", statusCode: 400 };
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    const total = calculateTotalItems({ cartItems: otherCartItems });


    cart.items = otherCartItems;
    cart.totalPrice -= total;

    const updatedCart = await cart.save();

    return { data: updatedCart, statusCode: 200 };
}

interface ClearCart {
    userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
    const cart = await getActiveCart({ userId });
    if (!cart) {
        return { data: "Cart not found", statusCode: 400 };
    }
    cart.items = [];
    cart.totalPrice = 0;
    const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 200 };
}

interface Checkout {
    userId: string;
    address: string;
}

export const checkout = async ({ userId, address }: Checkout) => {
    if (!address) {
        return { data: "Address is required", statusCode: 400 };
    }

    const cart = await getActiveCart({ userId });
    const orderItems: IOrderItem[] = [];
    for (const item of cart.items) {
        const product = await productModel.findById(item.product);
        
        if (!product) {
            return { data: "Product not found", statusCode: 400 };
        }

        const orderItem: IOrderItem = {
            productTitle: product.title,
            productImage: product.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
        }
        orderItems.push(orderItem);
    }

    const order = await OrderModel.create({
        userId,
        orderItems,
        totalPrice: cart.totalPrice,
        address,
    });
    await order.save();
    cart.status = "completed";
    await cart.save();
    return { data: order, statusCode: 200 };
}




    const calculateTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
        const total = cartItems.reduce((sum, product) => {
            sum += product.quantity * product.unitPrice;
            return sum;
        }, 0)
        return total;
    }
