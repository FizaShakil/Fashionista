import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
        <div className=' w-[85%] min-[600px]:w-[400px] mt-8 relative left-1/2 transform -translate-x-1/2'>
            <h1 className='text-4xl text-center font-bold mt-8'>Login</h1>
            <div className='mt-8'>
                <input 
                       type="email" 
                       className='border-2 border-gray-300 w-[100%] pl-2 py-2 text-gray-600'
                       placeholder='Enter your Email'
                       required 
                />
                <input 
                       type="password" 
                       className='border-2 w-[100%] border-gray-300 pl-2 py-2 mt-6 text-gray-600'
                       placeholder='Enter your Password' 
                       required
                />
            </div>
            <Link to={'/'}>
                         <button className=' w-[100%] py-2 mt-6 bg-gray-900 text-white'>
                                  Login
                        </button>
            </Link>
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