import React, {useState} from 'react'
export default function AuthForm(){
    const [isLogin,setIsLogin]=useState(true);
    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
        <button className={isLogin ? 'active' : ""}onClick={()=> setIsLogin(true)}>Login</button>
        <button className={!isLogin ? 'active' : ""}onClick={()=> setIsLogin(false)}>SignUp</button>
                </div>
                {isLogin ? <>
                <div className='form'>
                    <h2>Login Form</h2>

        <input type='email' placeholder='Email'/> 
        <input type='password' placeholder ='password'/>
        
        <button>Login</button>  
              
        </div>
                </> : <>
                <div className='form'>
                 <h2>SignUp Form</h2>
        <input type='Name' placeholder ='Name'/>
        <input type='email' placeholder='Email'/> 
        <input type='password' placeholder ='password'/>
        <input type='Role' placeholder ='Role'/>
        <button>SignUp</button>
        </div>
                </>}
            </div>
        </div>
    )
}
