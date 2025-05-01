import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { setUser } from '../../Redux/userSlice';
import axiosInstance from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
  
    const handleSignup = async (e) => {
      e.preventDefault();
      setErrorMsg("");
  
      try {
        const res = await axiosInstance.post("/api/v1/users/register", { username, email, password });
  
        dispatch(setUser(res.data.data));
        navigate("/");
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMsg(error.response.data.message);
        } else {
          setErrorMsg("Something went wrong. Please try again.");
        }
      }
    };
  
    return (
        <div className='w-[85%] min-[600px]:w-[400px] mt-8 relative left-1/2 transform -translate-x-1/2'>
            <h1 className='text-4xl text-center font-bold mt-8'>Signup</h1>
            <div className='mt-8'>

      <form onSubmit={handleSignup} className="mt-8">
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
          className="border-2 border-gray-300 w-full pl-2 py-2 rounded-md text-gray-600"
          placeholder="Enter your Name"
          required
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          className="border-2 border-gray-300 w-full pl-2 py-2 mt-6 rounded-md text-gray-600"
          placeholder="Enter your Email"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          className="border-2 border-gray-300 w-full pl-2 py-2 rounded-md mt-6 text-gray-600"
          placeholder="Enter your Password"
          required
        />
   {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        <button
          type="submit"
          className="w-full py-2 mt-6 bg-gray-900 rounded-md text-white"
        >
          Register
        </button>
        <div className='w-[100%] flex justify-center mt-5'>
                     <p>Already have an account?</p>
                         <Link to={'/login'}
                             className='font-semibold ml-2 hover:underline'> 
                                  Login here
                        </Link>
                     
                </div>
      </form>
    </div>
    </div>
  );
};

export default Signup;
