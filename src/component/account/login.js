import React,{useState,useEffect} from 'react';
import axios from 'axios'
import {useNavigate ,Link} from "react-router-dom";
import GoogleButton from 'react-google-button'
import "../../style/signUp.css";

function Login(){
    const navigate=useNavigate()
    const [eventInfo,setEventInfo]=useState({password:'',email:''});
    const [error,setError]=useState('')
    const {password,email}=eventInfo
    const [laoder,setLoader]=useState(false);

    

    const handleChange=(event)=>{
        const {name,value}=event.target
        setEventInfo({...eventInfo,[name]:value})
    }
    const googleSignUp=async ()=>{
        setLoader(true)
        window.open("https://glacier.onrender.com/auth/google","_self");
    }
   
    const onSubmit=async (e)=>{
        e.preventDefault();
        setLoader(true)
        const formData=new FormData();
        formData.append('password',password);
        formData.append('email',email);
        try{
                await axios.post('https://glacier.onrender.com/login',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then((res)=>{
                window.localStorage.setItem('isAuthenticated',res.data.express.isAuthenticated)
                window.localStorage.setItem('id',res.data.express.id)
                navigate("/home/"+res.data.express.id)
            })
            .catch((error)=>{
                setLoader(false)
                setError(error.response.data.express)
            })

        }
        catch(err){
            //console.log(err)
        }
    } 

    useEffect(()=>{
        if(window.localStorage.getItem("isAuthenticated")==="true"){
            navigate("/home/"+window.localStorage.getItem("id"))
        }else{
            setLoader(false)
        }
        
    } ,[])
   
    return(
            <div className='accountContainer'>
                <div className='accountContainerCenter'>
                    <div>
                        <form  onSubmit={onSubmit}  encType="multipart/form-data">
                            <div>
                            <input type="email" placeholder="EmailName@.com" name="email" onChange={handleChange} required></input>
                            </div>
                            <div>
                            <input type="password" placeholder="passWord ..." name="password" onChange={handleChange} required></input>
                            </div>
                           
                            <div className='accountContainerCenter__Section1'>
                                <button>login</button> 
                                <Link to={"/signup"} >signup</Link>
                            </div>


                            <Link to={"/verifyEmail"} className='accountContainerCenter__forgotPassword'>forgot  password</Link>


                            {laoder ?
                            <p style={{"textAlign":"center"}}> 
                                    Loading...
                            </p>  
                            :
                            <div className='accountContainerCenter__google'> 
                            <GoogleButton  className='accountContainerCenter__google_button' onClick={(e) => {googleSignUp(e) }}/>
                            </div>  
                            
                            }
                                                    
                            <div className='accountContainerCenter__error'>   {error?error:""}</div>
                            <div className='accountContainerCenter__logo'>Glac</div>
                        </form>
                    </div>
                    <div></div>
                </div>
            </div>
        
    )
}
export default Login; 