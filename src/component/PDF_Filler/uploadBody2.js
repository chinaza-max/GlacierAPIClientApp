import React,{Fragment,useState,useEffect} from 'react';
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "../../style/uploadBody.css"
import Swal from 'sweetalert2';





/*upload PDF*/
const UploadBody=(props)=>{
    const [file,setFile]=useState('');
    const [filename,setFilename]=useState('Choose file');
    const [uploadedFile,setUploadedFile]=useState({});
    const [eventInfo,setEventInfo]=useState({courseCode:''});

    const{courseCode}=eventInfo
    let i=0;

    const onChange=(e)=>{
    
        if(e.target.files[0]){
            setFile(e.target.files[0]);
            setFilename(e.target.files[0].name)
        }
    }
    
    const handleChange=(event)=>{
        const {name,value}=event.target
        setEventInfo({...eventInfo,[name]:value})
    }
    const emptyInput=()=>{
        let elem1 = document.getElementById("courseCode");
        let elem2 = document.getElementById("inputGroupFile03");
        elem1.value='';
        elem2.value='';
        setFilename('Choose file')
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
                        timer: 1500
                      }).then(()=>{
                        let submitButton = document.getElementById('submitID');
                        let input =document.querySelectorAll("input")
                        // enable the submit button
                        submitButton.disabled = false;
                        input.forEach((ele)=>{
                            ele.disabled=false
                        })
                      })
                      emptyInput();
                }
              }
            }
          }
    }
    const onSubmit=async (e)=>{
        e.preventDefault();
        const formData=new FormData();
        formData.append('file',file);
        formData.append('courseCode',courseCode);

        try{
            const res=await axios.post('https://glacier.onrender.com/uploadPDF/'+props.id,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });

            const{message,errMessage}=res.data
            setUploadedFile({errMessage})
          
            if(message){
                move()
            }
        }
        catch(err){
            if(err){
                console.log(err)
            }
            else{
                console.log(err.response.data.msg)
            }
        }
    }
    useEffect(()=>{
        let form = document.getElementById('formID');
        let submitButton = document.getElementById('submitID');
        let input=document.querySelectorAll(".input")
        form.addEventListener('submit', function() {
        // Disable the submit button
        submitButton.setAttribute('disabled', true);
        input.forEach((ele)=>{
            ele.setAttribute('disabled', true);
        })
        // Change the "Submit" text
        submitButton.value = 'Please wait...';             
        }, false)

        return(()=>{
            window.removeEventListener('submit', function() {
                // Disable the submit button
                submitButton.setAttribute('disabled', true);
           
                // Change the "Submit" text
                submitButton.value = 'Please wait...';             
            })
        })
    })
    return(
        <Fragment>
            <div className="container">
    
                <form onSubmit={onSubmit} id="formID" encType="multipart/form-data">
                    <div className="custom-file mt-4">
                        <input type="file" name="file" className="custom-file-input input" id="inputGroupFile03" aria-describedby="inputGroupFileAddon03" onChange={(e)=>onChange(e)} required/>
                        <label className="custom-file-label" htmlFor="inputGroupFile03">{filename}</label>
                    </div>
                    {uploadedFile.errMessage ? <h6 className='error'>{uploadedFile.errMessage}</h6>:null}
                    <div className="Author"> 
                    
                        <label>course code :</label>
                        <input type="text" name="courseCode" className='input' id="courseCode" onChange={handleChange} required/>
                    </div>
                    <input type="submit" value="Upload"  id="submitID"  className="btn btn-primary btn-block  mt-4"/>
                </form>
               
                <div id="myProgress">
                    <div id="myBar"></div>
                </div>
            </div>
        </Fragment>
    )
}

export default UploadBody;