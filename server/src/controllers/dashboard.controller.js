import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';

export const getTotalUsers = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  return res.status(200)
  .json(
    new ApiResponse(200, { totalUsers: count }, 'Total users fetched')
  );
});

export const getTotalProducts = asyncHandler(async (req, res) => {
  const count = await Product.countDocuments();
  return res.status(200)
  .json(new ApiResponse(200, { totalProducts: count }, 'Total products fetched')
);
});

export const getTotalOrders = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments();
  return res.status(200)
  .json(new ApiResponse(200, { totalOrders: count }, 'Total orders fetched')
);
}); 