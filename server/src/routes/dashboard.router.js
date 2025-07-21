import { Router } from 'express';
import { getTotalUsers, getTotalProducts, getTotalOrders } from '../controllers/dashboard.controller.js';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js';

const dashboardRouter = Router();

dashboardRouter.get('/total-users', verifyAdminJWT, isAdmin, getTotalUsers);
dashboardRouter.get('/total-products', verifyAdminJWT, isAdmin, getTotalProducts);
dashboardRouter.get('/total-orders', verifyAdminJWT, isAdmin, getTotalOrders);

export default dashboardRouter; 