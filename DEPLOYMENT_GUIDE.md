# Deployment Guide for Fashionista Backend

## Environment Variables for Render Deployment

Make sure to set these environment variables in your Render dashboard:

### Required Variables:
```
NODE_ENV=production
PORT=10000 (or whatever port Render assigns)
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### CORS Configuration:
```
CORS_ORIGIN=https://your-frontend-domain.com,https://your-admin-domain.com
```

**Important:** Replace `your-frontend-domain.com` with your actual frontend domain (e.g., `https://fashionista-client.onrender.com`)

### Cookie Configuration:
The application now automatically handles cookie security based on the environment:
- **Development**: `secure: false`, `sameSite: 'lax'`
- **Production**: `secure: true`, `sameSite: 'none'`

## Common Issues and Solutions:

### 1. 400 Bad Request Errors
- **Cause**: CORS not properly configured or cookies not being sent
- **Solution**: Ensure `CORS_ORIGIN` includes your frontend domain

### 2. Authentication Failures
- **Cause**: Cookies not being set properly in production
- **Solution**: The updated code now handles this automatically

### 3. CORS Errors
- **Cause**: Frontend domain not in allowed origins
- **Solution**: Add your frontend URL to `CORS_ORIGIN`

## Testing:
1. Deploy with the updated code
2. Check server logs for any missing environment variables
3. Test login functionality
4. Verify that protected routes work after login

## Debugging:
The updated middleware now includes console logs to help debug authentication issues. Check your Render logs for:
- "No token found in request"
- "JWT verification error"
- "CORS blocked origin" 