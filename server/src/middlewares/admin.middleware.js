import { ApiError } from "../utils/ApiError.js";

// Middleware that verifies the authenticated user holds the 'admin' role.
// Must be used AFTER a JWT verification middleware (verifyAdminJWT) which
// populates req.user. Returns 403 Forbidden for authenticated non-admin users.
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next()
    }
    throw new ApiError(403, "Forbidden: admin access required")
}

export default isAdmin;
