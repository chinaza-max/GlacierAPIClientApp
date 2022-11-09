import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../style/noMatchContainer.css"
import {useEffect,useState } from 'react';
import {useParams,useNavigate} from "react-router-dom";
import AccomodationNav from "./AccomodationNav";
import Swal from 'sweetalert2'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ScrollTop from "../reUse/scrollTop";
import axios from 'axios'

  

function Accomodation(props){
    const[accomodation,setaccomodation]=useState([]);
    const[search,setsearch]=useState([]);
    const[search2,setsearch2]=useState("All");
    const[tel,setTel]=useState("All");
    const {id}=useParams(); 
    const navigate=useNavigate()
    const[loaderStatus,setLoaderStatus]=useState(true)
    


    function ShowImage(url,about,title){
        Swal.fire({
            title,
            text: about,
            imageUrl: url,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
    }

    function requestAccomodation(){
        navigate("/home/"+id+"/Accomodation_UploadRequest")
    }
    function filterFunc(value){
        setsearch(value.toLowerCase());
    }
    function accomodationFunc(value){
        setsearch2(value);
    }
    function isNumeric(num){
        return !isNaN(num)
    }
    function removeAccomodation(name){
        
        Swal.fire({
            title: 'remove accomodation from database?',
            showCancelButton: true,
            titleColor:"#ED3137",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
                
                    const response=await fetch("https://glacier.onrender.com/deleteSingleAccomodation/"+name,{
                        headers : { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                           }
                    })
                    const body=await response.json() 
                    if(body.express=== "No user found"){
                        Swal.fire(
                            'NotDeleted!',
                            'Your file was not deleted.',
                            'Failed'
                        )  

                    }
                    else{
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        ).then(()=>{
                            let newUpdate=accomodation.filter((obj)=>{
                                return    obj.unique!==name
                            })
                            setaccomodation(newUpdate)
                        })   
                       
                    }
            }
        })


    }
    useEffect(()=>{
    

        setLoaderStatus(true)
//this condition help check help if the user is properly login
            if(id==="undefined"){
                navigate("/login")
            }

    async   function init(){
        
            try{
                await axios.get("https://glacier.onrender.com/accomodations",{
                }).then((res)=>{
                    if(res.data.express===""){
                        setaccomodation([])
                    }
                    else{
                        setLoaderStatus(false)
                        setaccomodation(res.data.express)
                    }
                })
                .catch((error)=>{
                // console.log(error.response.data.express)
                })
            }
            catch(err){
              //  console.log(err)
            }
            try{
                await axios.get(`https://glacier.onrender.com/phone/${id}`,{
                }).then((res)=>{
                        setTel(res.data.express)
                
                })
                .catch((error)=>{
                // console.log(error.response.data.express)
                })
            }
            catch(err){
              //  console.log(err)
            }
        }
        init()
       
    },[navigate,id])
  
    let NoResultFound=()=>{
        return(
            <div className="noMatchContainer">
                { accomodation.length!==0?
                    <h6 className="sub_noMatchContainer">Does not match any results!</h6>
                    :
                    <h6 className="sub_noMatchContainer">No available accomodation at the moment!</h6>
                }
           
                <h5 className="sub_noMatchContainer"  id="sub_noMatchContainer_click"onClick={()=>requestAccomodation()}><AddCircleOutlinedIcon/>request accomodation or roommate</h5>
            </div>
        )
    }
    let resultFound=accomodation.filter((data)=>{
        if(data==='test'){
             return false
        }
        else{
           
            if(data.selection.toLowerCase().indexOf(search)===-1 && data.Address.toLowerCase().indexOf(search)===-1){
                if(isNumeric(search) && search.length>0){
                    let convertedNum=Number(search)
                    if( convertedNum<=data.price){
                        return true
                    }
                    else{
                        return false
                    }
                }
                else{
                 //   searchResult="empty"
                    return  false
                }
            }
            else if(search2.toLowerCase()==="All".toLowerCase()){
                
              //  searchResult="empty";
                return true
            }

            else if(data.selection.toLowerCase()===search2.toLowerCase()){
              //  searchResult="filled";
                return true
            }
            else{
                 // searchResult="empty"
                  return false
            }
        }
    })

    resultFound=resultFound.map((data)=>{
                return(
                    <div key={data.unique} className="accomodation_body">
                        <div className="img_container">
                            <img className="bodyImg" src={data.driveURL?data.driveURL:"/accomodationImg/firstImg.jpg"} alt={"/accomodationImg/firstImg.jpg"} onClick={()=>{ShowImage(data.driveURL?data.driveURL:data.name,data.Address,data.selection)}}/> 
                        </div>
                        <div className="info1">
                            <div className="accomodation_type">
                                <h3>{data.selection}</h3>
                            </div>
                            <div className="address_display">
                                {data.Address}
                            </div>
                            <div className="tel_display">
                                {data.tel}
                            </div>
                        </div>
                        <div className="info2">
                            <div className="remove_container">
                    
                                {data.id===id||tel===8184724615? <button onClick={()=>removeAccomodation(data.unique)}>remove</button>:null}
                            
                            </div>
                            <div className="price_container">
                                <h5>price (NGN):{data.price}</h5>
                            </div>
                        </div>
                    </div>
                )

    })
  
    return(
    
        <div className="Accomodation">

            <AccomodationNav filterFunc={filterFunc} accomodationFunc={accomodationFunc} history={props.history}/>
            <div className="accomodation_body_container">
                <div  className="accomodation_body_container_sub">


                {loaderStatus?<h4 style={{"textAlign":"center","marginTop":"30px"}}>LOADING .... </h4>:
                
                accomodation.length>0? (resultFound[0]==='')?<NoResultFound/>:resultFound
                :
                <NoResultFound/>
                }
  
                </div>
            </div>
            <ScrollTop/>
        </div>
    )
}
export default Accomodation;