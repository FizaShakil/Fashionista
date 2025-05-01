import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import { setUser } from '../../Redux/userSlice';
import axiosInstance from '../../axiosInstance';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMsg(""); // clear previous error
  
      try {
        const res = await axiosInstance.post(
            "/api/v1/users/login", 
            { email, password }
        );
  
        dispatch(setUser(res.data.data.user));
        navigate("/"); // Redirect home after login
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMsg(error?.response?.data?.message);
        } else {
          setErrorMsg("Something went wrong. Please try again.");
          console.log("Following error occurs:", error)
        }
      }
    };
    
  return (
    <div>
        <div className='w-[85%] min-[600px]:w-[400px] mt-8 relative left-1/2 transform -translate-x-1/2'>
            <h1 className='text-4xl text-center font-bold mt-8'>Login</h1>
            
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
                         <button type='submit' className=' w-[100%] py-2 mt-6 bg-gray-900 rounded-md text-white'>
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
                          className='font-semibold ml-2 hover:underline'> 
                              Signup Now
                    </Link>
                 
            </div>
        </div>
        
    </div>
  )
}

export default Login