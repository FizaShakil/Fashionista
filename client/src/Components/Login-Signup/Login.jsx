import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { setUser } from '../../Redux/userSlice';
import { setCartItems } from '../../Redux/cartSlice';
import axiosInstance from '../../axiosInstance';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
     const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMsg("");
      try {
        const res = await axiosInstance.post(
            "/api/v1/users/login", 
            { email, password }
        );
        const { user, accessToken } = res.data.data;
        // console.log("My Response:", res.data.data)
       const authUser = { ...user, accessToken };
        dispatch(setUser(authUser));

    // Sync cart
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (localCart.length > 0) {
      try {
      await axiosInstance.post("/api/v1/cart/sync", { cartItems: localCart }, {
          headers: { Authorization: `Bearer ${accessToken}` }
      });
      localStorage.removeItem("cart");
      } catch (syncError) {
        console.error("Cart sync error:", syncError);
        // Continue with login even if cart sync fails
      }
    }

    try {
      const { data } = await axiosInstance.get(`/api/v1/cart/get-cart`, {
          headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (data.data && data.data.products) {
        // Transform the cart data to match the expected format
        const cartItems = data.data.products.map(item => ({
          ...item.productID,
          quantity: item.quantity
        }));
        dispatch(setCartItems(cartItems));
      }
    } catch (cartError) {
      console.error("Get cart error:", cartError);
      // Continue with login even if getting cart fails
    }

    navigate("/");
  }
     catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMsg(error?.response?.data?.message);
        } 
        else {
          setErrorMsg("Something went wrong. Please try again.");
          console.log("Following error occurs:", error)
        }
  }
};
    
  return (
    <div>
        <div className='w-[85%] min-[600px]:w-[400px] mt-8 relative left-1/2 transform -translate-x-1/2'>
            <h1 className='text-4xl text-center font-bold mt-8 text-[#224059]'>Already Registered? Login Here</h1>
            
        <form onSubmit={handleLogin}>
                <div className='mt-8'>
                <input 
                       type="email" 
                       className='border-2 mt-8 border-gray-300 w-[100%] rounded-md pl-2 py-2 text-gray-600'
                       placeholder='Enter your Email'
                       value={email}
                       onChange={(e)=> setEmail(e.target.value)}
                       required 
                />
                <input 
                       type="password" 
                       className='border-2 w-[100%] border-gray-300 pl-2 rounded-md py-2 mt-6 text-gray-600'
                       placeholder='Enter your Password'
                       value={password} 
                       onChange={(e)=> setPassword(e.target.value)}
                       required
                />
            </div>
            {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
                         <button type='submit' className=' w-[100%] py-2 mt-6 bg-[#193246] rounded-md text-white'>
                                  Login
                        </button>
             
        </form>
            <Link to={'/'}
                   className='hover:text-gray-800 hover:underline'>
                    Forgot Password?
            </Link>
            <div className='w-[100%] flex justify-center mt-5'>
                <p>New to Fashionista?</p>
                    <Link to={'/signup'}
                          className='font-semibold ml-2 hover:underline text-[#193246]'> 
                              Signup Now
                    </Link>
                 
            </div>
        </div>
        
    </div>
  )
}

export default Login