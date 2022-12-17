// Dependencies
import { Request, Response } from "express";
import { nanoid } from "nanoid";

// Types
import { CartItem, CartItemDetails } from "../../interfaces";

// Services
import { cartService } from "../../services/client";
import { ErrorObj } from "../../utils";

// Helper function
const getCartResultFromSession = async (
	updatedCart: Partial<CartItem>[]
): Promise<CartItemDetails[]> => {
	const cartItemsDetails = await cartService.getSessionCartItemsDetails(
		updatedCart.map(item => item.product_id!)
	);

	const cartResult = updatedCart.map(item => {
		const cartItemData = cartItemsDetails.rows.find(product => product.id === item!.product_id);
		return {
			...cartItemData,
			quantity: item?.quantity,
			size: item?.size,
			id: item?.id
		};
	});

	return cartResult;
};

export const getCartItems = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	try {
		let cart: Partial<CartItem>[];
		let sync: boolean = false;

		if (!userId) {
			// Return session cart items
			const currentCart = req.session.cart || [];

			const cartResult = await getCartResultFromSession(currentCart);

			cart = cartResult;
		} else {
			const cartResultDB = await cartService.getDBCartItemsDetails(userId);

			if (req.session.cart && req.session.cart?.length !== 0) {
				sync = true;
			}

			cart = cartResultDB.rows;
		}

		res.status(200).json({
			status: "success",
			data: { cart, ...(userId && { sync }) }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const syncCartItems = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("You're not logged in!");
		} else {
			// Sync session cart to db
			const sessionCartItems = req.session.cart || [];

			if (sessionCartItems.length < 1) {
				throw new ErrorObj.ClientError("Session cart is empty!");
			}

			await cartService.syncCartItems(sessionCartItems as Omit<CartItem, "user_id">[], userId);

			// Clear cart session
			req.session.cart = [];

			const cartResultDB = await cartService.getDBCartItemsDetails(userId);

			const cart = cartResultDB.rows;

			return res.status(200).json({
				status: "success",
				data: { cart, ...(userId && { sync: false }) }
			});
		}
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
export const clearSessionCart = async (req: Request, res: Response) => {
	try {
		req.session.cart = [];

		return res.status(200).json({
			status: "success"
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const addProductToCart = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	const { product_id, quantity, size }: CartItem = req.body;

	const newCartItem = {
		id: nanoid(),
		product_id,
		size,
		quantity
	};
	let cartResult: CartItemDetails[] = [];

	try {
		if (!product_id || isNaN(+quantity) || isNaN(+size)) {
			throw new ErrorObj.ClientError("Cart data not valid, please provide a valid data.");
		}

		if (+quantity === 0) {
			throw new ErrorObj.ClientError("Quantity should not be 0.");
		}

		if (!userId) {
			const currentCart = req.session.cart || [];

			const updatedCart = cartService.addProductToSessionCart(currentCart, newCartItem);

			req.session.cart = updatedCart;

			cartResult = await getCartResultFromSession(updatedCart);
		} else {
			// Add product to db
			await cartService.addProductToDBCart(newCartItem, userId);

			cartResult = (await cartService.getDBCartItemsDetails(userId)).rows;
		}

		return res.status(200).json({
			status: "success",
			data: { cart: cartResult }
		});
	} catch (error: any) {
		console.error(error.stack);

		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateCartItem = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	const { id: cartItemId, quantity }: CartItem = req.body;

	try {
		if (!cartItemId || isNaN(+quantity)) {
			throw new ErrorObj.ClientError("Cart data not valid, please provide a valid data.");
		}

		if (+quantity === 0) {
			throw new ErrorObj.ClientError("Quantity should not be 0.");
		}

		let cartResult: CartItemDetails[];
		if (!userId) {
			// Edit product in session cart
			const currentCart = req.session.cart || [];

			const updatedCart = cartService.updateCartItemInCartSession(
				currentCart,
				cartItemId,
				quantity
			);

			req.session.cart = updatedCart;

			cartResult = await getCartResultFromSession(updatedCart);
		} else {
			// Edit product to db
			await cartService.updateCartItemInDB(cartItemId, quantity, userId);

			cartResult = (await cartService.getDBCartItemsDetails(userId)).rows;
		}

		return res.status(200).json({
			status: "success",
			data: { cart: cartResult }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteCartItem = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	const { id: cartItemId }: CartItem = req.body;

	let cartResult: CartItemDetails[];

	try {
		if (!cartItemId) {
			throw new ErrorObj.ClientError("Invalid cart item id!");
		}

		if (!userId) {
			// Edit product in session cart
			const currentCart = req.session.cart || [];

			const updatedCart = cartService.deleteCartItemInCartSession(currentCart, cartItemId);

			req.session.cart = updatedCart;

			cartResult = await getCartResultFromSession(updatedCart);
		} else {
			// Edit product to db
			await cartService.deleteCartItemInDB(cartItemId, userId);

			cartResult = (await cartService.getDBCartItemsDetails(userId)).rows;
		}

		return res.status(200).json({
			status: "success",
			data: { cart: cartResult }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
