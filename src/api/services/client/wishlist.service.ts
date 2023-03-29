// Data
import { wishlistRepo, productRepo } from "../../data/client";

// Utils
import { ErrorObj } from "../../utils";

export const getWishlistProducts = async (userId: string) => {
	const wishlist = await wishlistRepo.getWishlistProducts(userId);

	return wishlist;
};

export const addProductToWishlist = async (productId: string, userId: string) => {
	// Check product exist
	const exist = await productRepo.checkProductExistById(productId);

	if (!exist) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	const wishlisted = await wishlistRepo.checkProductIsWishlisted(productId, userId);

	if (wishlisted) {
		throw new ErrorObj.ClientError("Product already wishlisted!", 404);
	}

	await wishlistRepo.addProductToWishlist(productId, userId);

	const wishlist = await wishlistRepo.getWishlistData(userId);

	return wishlist;
};

export const deleteProductFromWishlist = async (productId: string, userId: string) => {
	// Check product exist
	const exist = await productRepo.checkProductExistById(productId);

	if (!exist) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	const wishlisted = await wishlistRepo.checkProductIsWishlisted(productId, userId);

	if (!wishlisted) {
		throw new ErrorObj.ClientError("Product not found in wishlist!", 404);
	}

	await wishlistRepo.deleteProductFromWishlist(productId, userId);

	const wishlist = await wishlistRepo.getWishlistData(userId);

	return wishlist;
};

export const emptyWishlist = async (userId: string) => {
	const wishlist = await wishlistRepo.emptyWishlist(userId);

	return wishlist;
};
