import React,{Fragment,useState,useEffect} from 'react';
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../style/uploadBody.css";
import Swal from 'sweetalert2';
//import componentProps from "../reUse/Payment"
import { PaystackButton } from "react-paystack"
import "../../style/Payment.css"
let array=[]
let fileINC=0

const UploadBodyBook=(props)=>{
    const [file,setFile]=useState('');
    const [filename,setFilename]=useState('upload Book Cover');
    const [uploadedFile,setUploadedFile]=useState({});
    const [eventInfo,setEventInfo]=useState({author:'',title:'',faculty:'',Description:'',tel:''});
    const [errorPhone,setErrorPhone]=useState('')
    const [uploadStatus,setUploadStatus]=useState(false)
    const [freeUpload,setFreeUpload]=useState(true)
    const [apikeys,setApikey]=useState("")
    const [email,setEmail]=useState("")
  


    const componentProps = {
        email,
        amount:10000,
        publicKey:apikeys,
        text: "upload now",
        onSuccess: () =>{
        alert("Thanks for doing business with us! Come back soon!!")
        onPayment()
        },
        onClose: () => alert("Wait! You need this oil, don't go!!!!"),
      }
    const{author,title,faculty,Description,tel}=eventInfo
    let i=0;
    
    const onChange=(e)=>{
        if(e.target.files[0]!==undefined){
            setFile(e.target.files[0]);
            setFilename(e.target.files[0].name);
        }

        if(fileINC===0){
            fileINC++
            if(showButton(e.target.files[0].name)){
                setUploadStatus(true)
            }
        }
    }
    
    const handleChange=(event)=>{
       
        const {name,value}=event.target
        setEventInfo({...eventInfo,[name]:value})
        if(name==="tel"){
            if(validateTel(value)===true){
                setErrorPhone("")
                if(showButton(name)){
                   
                    setUploadStatus(true)
                }
                return
            }
            else{
                setErrorPhone(validateTel(value))
            }
        }
        if(showButton(name)){
            setUploadStatus(true)
        }
    }
    const showButton=(name)=>{
        let inArray=array.includes(name)
        if(inArray===false){
            array.push(name)
        }

        if(array.length>=6){
            return true
        }
        else{
            return false
        }
    }
    const validateTel=(value)=>{
        const number=/^[0-9]+$/
        if(value){
                if(!value.match(number)){
                    return "numeric character only Re-enter no"
                }
                else if(value.length<11){
                    return "incomplete number Re-enter no";
                }
                else if(value.length>11){
                    return "exceded limit Re-enter no";
                }
                else{
                    return true;
                }
        }
    }
    const emptyInput=()=>{
        setFilename('upload Book Cover')
        let elem1 = document.getElementById("inputGroupFile03");
        let elem2 = document.getElementById("author");
        let elem3 = document.getElementById("title");
        let elem4 = document.getElementById("faculty");
        let elem5 = document.getElementById("Description");
        let elem6 = document.getElementById("tel");
        elem2.value='';
        elem3.value='';
        elem4.value='';
        elem5.value='';
        elem6.value='';
        elem1.value="";
        let elem = document.getElementById("myBar");
        setTimeout(() => {
            elem.style.width = 2+ "%";
            elem.innerHTML= '';
        }, 1000);
    }
    const move=()=>{
        if (i === 0) {
            i = 1;
            let elem = document.getElementById("myBar");
            let width = 1;
            let id = setInterval(frame, 10);
            function frame() {
              if (width >= 100) {
                clearInterval(id);
                i = 0;
              } else {
                width++;
                elem.style.width = width + "%";
                elem.innerHTML= width + "%";
                if(width===100){
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your work has been upload successfully',
                        showConfirmButton: false,
                        timer: 2500
                      }).then(()=>{
                          if(freeUpload){
                            let submitButton = document.getElementById('submitID');
                            let input=document.querySelectorAll(".input")
                            // enable the submit button
                            submitButton.disabled = false;
                            input.forEach((ele)=>{
                                ele.disabled = false;;
                            })
                          }
                       
                        emptyInput();
                      })
                   
                }
              }
            }
          }
    }
    const onPayment=async ()=>{
        const formData=new FormData();
        formData.append('file',file);
        formData.append('author',author);
        formData.append('title',title);
        formData.append('faculty',faculty);
        formData.append('Description',Description);
        formData.append('tel',tel);

        try{
          
            const res=await axios.post('https://glacier.onrender.com/uploadBook/'+props.id,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            const{message,errMessage}=res.data
            setUploadedFile({errMessage})
            
            if(message==="success"){
                 move()
            }
        }
        catch(err){
            if(err){
               // console.log(err)
            }
            else{
                //console.log(err.response.data.msg)
            }
        }
    
    }
    
    const onSubmit=async (e)=>{
        e.preventDefault();
        if(freeUpload){
          
            const formData=new FormData();
            formData.append('file',file);
            formData.append('author',author);
            formData.append('title',title);
            formData.append('faculty',faculty);
            formData.append('Description',Description);
            formData.append('tel',tel);
            try{
              
                const res=await axios.post('https://glacier.onrender.com/uploadBook/'+props.id,formData,{
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                })
                const{message,errMessage}=res.data
                setUploadedFile({errMessage})
                
                if(message==="success"){
                     move()
                }
            }
            catch(err){
                if(err){
                   // console.log(err)
                }
                else{
                   // console.log(err.response.data.msg)
                }
            }
        }
       
    }
    useEffect(()=>{

    async    function getUpdate(){
                 
                try{
                    await axios.get(`https://glacier.onrender.com/email/${props.id}`,{
                }).then((res)=>{ 
                    setEmail(res.data.express)
                })
                .catch((error)=>{
                // console.log(error.response.data.express)
                })
                }
                catch(err){
                   // console.log(err)
                }
            
            //for updating check box
            try{
                await axios.get(`https://glacier.onrender.com/checkValue/${8184724615}`,{
            }).then((res)=>{ 
                setFreeUpload(res.data.express)
                setApikey(res.data.express2)
            })
            .catch((error)=>{
            // console.log(error.response.data.express)
            })
            }
            catch(err){
               // console.log(err)
            }
        }

        getUpdate();

        if(freeUpload){
            
            let form = document.getElementById("myForm");
            function handleForm(event) { event.preventDefault(); } 
            form.addEventListener('submit', handleForm);
            let submitButton = document.getElementById('submitID');
            let input=document.querySelectorAll(".input")
            //this listener disable button when there is multiple click
            form.addEventListener('submit', function() {
            // Disable the submit button
            submitButton.setAttribute('disabled', true);
            input.forEach((ele)=>{
                ele.setAttribute('disabled', true);
            })
            // Change the "Submit" text
            submitButton.value = 'Please wait...';             
            }, false);
        }
      
    },[props.id,freeUpload])
    return(
        <Fragment>
            <div className="container">
    
                <form onSubmit={(e)=>{onSubmit(e); return false}}   id="myForm" encType="multipart/form-data" >
                    <div className="custom-file mt-4">
                        <input type="file" name="file" className="custom-file-input input" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" onChange={onChange} required/>
                        <label className="custom-file-label" htmlFor="inputGroupFile03">{filename}</label>
                    </div>
                    {uploadedFile.errMessage ? <h6 className='error'>{uploadedFile.errMessage}</h6>:null}
                    <div className="Author">  
                        <label>Book Author :</label>
                        
                        <input type="text" name="author" className='input' id="author" onChange={handleChange} maxLength={30} required/>
                    </div>
                    <div className='title1'>  
                        <label>Title : </label>
                        <input type="text"  name="title" className='input' id="title" onChange={handleChange} maxLength={30} required />
                    </div>
                    <div className='Book-faculty'>  
                        <label>Book-faculty :</label>
                        <input type="text"  name="faculty" className='input' id="faculty" onChange={handleChange} maxLength={30} required/>
                    </div>
                    <div className='Description'>  
                        <label>Description :</label>
                        <textarea type="text" id="Description" className='input' placeholder="tell us little about the book to attract buyers" name="Description" onChange={handleChange} maxLength={250} required/>
                    </div>
                    <div className='tel'>  
                        <label>tel :</label>
                        <input type="tel" id="tel" name="tel" className='input' placeholder="your phone NO" onChange={handleChange} minLength={11} maxLength={11} required/>
                    </div>
                    <div className='container_tel'>{errorPhone}</div>

                    {
                        freeUpload===false?
                        uploadStatus?<PaystackButton className="paystack-button" {...componentProps} />:
                            ""
                            :
                        <input type="submit" value="Upload"  id="submitID"  className="btn btn-primary btn-block  mt-4"/>
                    }
                  
                </form>
                <div id="myProgress">
                    <div id="myBar"></div>
                </div>
       
            </div>
        </Fragment>
    )
}

export default UploadBodyBook;