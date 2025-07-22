import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartItems } from "../../Redux/cartSlice";
import axiosInstance from "../../axiosInstance";

export const useHandleAddToCart = ()=> {
     const dispatch = useDispatch();
     const { user } = useSelector((state) => state.user)
     const handleAddToCart = async (product) => {
      const normalizedProduct = {
        ...product,
        _id: product._id || product.productID,
        quantity: 1,
      };

  // If logged in => Add to database and update Redux
  if (user) {
  try {
      const productID = product._id || product.productID;
      if (!productID) {
     console.error("No product ID found for product:", product);
       return;
      }
    const response = await axiosInstance.post(
      "/api/v1/cart/add-to-cart",
      {
        productID: product._id || product.productID,
        quantity: product.quantity || 1
      }
    );

      // The server returns the cart object in response.data.data
      if (response.data.data && response.data.data.products) {
        const cartItems = response.data.data.products.map(item => ({
          ...item.productID,
          quantity: item.quantity
        }));
        dispatch(setCartItems(cartItems));
        console.log("Cart items in response", response.data.data.products);
      }
  } 
  catch (err) {
    console.error("Error in adding product in cart:", err);
  }
}
   else {
    // If not logged in => Add to localStorage and update Redux
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart];

    const index = updatedCart.findIndex((item) => item._id === normalizedProduct._id);

    if (index >= 0) {
      updatedCart[index].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    dispatch(setCartItems(updatedCart));
   }
 }
 return handleAddToCart;
}