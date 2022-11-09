import {useEffect,useState } from 'react';
import { Link } from "react-router-dom";
import '../../../style/section2.css';


function Section2(props){
    const[books,setBooks]=useState([])
    const[loaderStatus,setLoaderStatus]=useState(true)


     useEffect(()=>{

        setLoaderStatus(true)
        const aboutController=new AbortController()
        const signal=aboutController.signal
     async function fetchData(){
            const response=await fetch("https://glacier.onrender.com/Books",{signal:signal}, {
                headers : { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
            })
            const body=await response.json()
            setBooks(body.express)
            setLoaderStatus(false)
            localStorage.setItem('numberOfBook', JSON.stringify(body.express.length))
       }
      fetchData();

      return ()=> aboutController.abort()
    },[])



    let data=books.filter((data)=>{
  
       if(data==='test'){
            return false
       }
       else{
            if(data.name.indexOf(props.searchString2.toLowerCase())===-1 && data.title.indexOf(props.searchString2.toLowerCase())===-1 && data.author.indexOf(props.searchString2.toLowerCase())===-1 && data.faculty.indexOf(props.searchString2.toLowerCase())===-1){
                return false
            }
        
            else{
    
                return true;
            }
       }
    })



    data=data.map((data)=>{

                 return(
                     <div key={data.name} className="mainBody-sub">
                         
                             <div className="mainBody-subCenter">
                                 <Link className="books" to={"/details/"+data.name}>  <img className="bodyImg" src={data.driveURL} alt="file cant show!"/>  </Link>
                             </div>
                             <div className="booksTitle">
                                 {data.title}
                                     
                             </div>
                     </div>
                 )
 
     })
    return(
        <div className="mainBody-container" id="filler">
            <div className="mainBody">
            {loaderStatus?<h4 style={{"textAlign":"center","marginTop":"30px"}}>LOADING .... </h4>:data}
            
            </div>
        </div>
    )
}

export default Section2


