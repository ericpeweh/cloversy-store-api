// Data
import { cartRepo, productRepo } from "../../data/client";

// Types
import { CartItem } from "../../interfaces";

// Utils
import { ErrorObj } from "../../utils";

export const getSessionCartItemsDetails = async (productIds: string[]) => {
	const cartItems = await cartRepo.getSessionCartItemsDetails(productIds);

	return cartItems;
};

export const getDBCartItemsDetails = async (userId: string) => {
	const cartItems = await cartRepo.getDBCartItemsDetails(userId);

	return cartItems;
};

export const addProductToSessionCart = (
	currentCart: Partial<CartItem>[],
	newCartItem: Omit<CartItem, "user_id">
) => {
	// Add product to session cart
	const { product_id, size, quantity } = newCartItem;
	let updatedCart: Partial<CartItem>[];

	const isExist =
		currentCart.findIndex(item => item.product_id === product_id && item.size === size) !== -1;

	if (isExist) {
		updatedCart = currentCart.map(item => {
			return item.product_id === product_id
				? {
					...item,
					quantity: (item?.quantity ? item.quantity : 0) + +quantity
				  }
				: item;
		});
	} else {
		updatedCart = [...currentCart, newCartItem];
	}

	return updatedCart;
};

export const addProductToDBCart = async (
	newCartItem: Omit<CartItem, "user_id">,
	userId: string
) => {
	const { product_id } = newCartItem;

	const isProductExist = await productRepo.checkProductExistById(product_id + "");

	if (!isProductExist) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	const isExist = await cartRepo.checkCartItemExist(newCartItem, userId);

	let cartItem: CartItem[];
	if (isExist) {
		cartItem = (await cartRepo.updateCartItemWithoutId(newCartItem, userId)).rows;
	} else {
		cartItem = (await cartRepo.addCartItemToDB(newCartItem, userId)).rows;
	}

	return cartItem;
};

export const syncCartItems = async (
	sessionCartItems: Omit<CartItem, "user_id">[],
	userId: string
) => {
	for (const cartItem of sessionCartItems) {
		await cartRepo.addCartItemToDBIfNotExist(cartItem, userId);
	}
};

export const updateCartItemInCartSession = (
	currentCart: Partial<CartItem>[],
	cartItemId: string,
	quantity: number
) => {
	// Update car item quantity to session cart
	const isExist = currentCart.findIndex(item => item.id === cartItemId) !== -1;

	if (!isExist) {
		throw new ErrorObj.ClientError("Cart item not found!");
	}

	const updatedCart: Partial<CartItem>[] = currentCart.map(item => {
		return item.id === cartItemId
			? {
				...item,
				quantity
			  }
			: item;
	});

	return updatedCart;
};

export const updateCartItemInDB = async (cartItemId: string, quantity: number, userId: string) => {
	const isExist = cartRepo.checkCartItemExistById(cartItemId);

	if (!isExist) {
		throw new ErrorObj.ClientError("Cart item not found!");
	}

	const isAuthorized = cartRepo.checkCartItemAuthorized(cartItemId, userId);

	if (!isAuthorized) {
		throw new ErrorObj.ClientError("You're not authorized", 403);
	}

	await cartRepo.updateCartItemById(cartItemId, quantity, userId);
};

export const deleteCartItemInCartSession = (
	currentCart: Partial<CartItem>[],
	cartItemId: string
) => {
	// Delete cart item from session cart
	const isExist = currentCart.findIndex(item => item.id === cartItemId) !== -1;

	if (!isExist) {
		throw new ErrorObj.ClientError("Cart item not found!");
	}

	const updatedCart: Partial<CartItem>[] = currentCart.filter(item => item.id !== cartItemId);

	return updatedCart;
};

export const deleteCartItemInDB = async (cartItemId: string, userId: string) => {
	// Delete cart item from session cart
	const isExist = cartRepo.checkCartItemExistById(cartItemId);

	if (!isExist) {
		throw new ErrorObj.ClientError("Cart item not found!");
	}

	const isAuthorized = cartRepo.checkCartItemAuthorized(cartItemId, userId);

	if (!isAuthorized) {
		throw new ErrorObj.ClientError("You're not authorized", 403);
	}

	await cartRepo.deleteCartItemById(cartItemId, userId);
};
