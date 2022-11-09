import {useState,useEffect} from "react"
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone';
import "../../style/filler.css"

function Filler(props){
    const[PDFs,setPDF]=useState([])
    const[loaderStatus,setLoaderStatus]=useState(true)


    useEffect(()=>{
        const aboutController=new AbortController()
        const signal=aboutController.signal
        setLoaderStatus(true)

        try{
            const init=async()=>{
                const response=await fetch("https://glacier.onrender.com/pdfAPI",{signal:signal}, {
                    headers : { 
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                     }
                  })
                const body=await response.json()
                setLoaderStatus(false)
                if(body.express.length===0){
                    return;
                }
                else{
                    setPDF(body.express)
                }
            }
            init();
        }
        catch(e){
            console.log(e)
        }
        return ()=> aboutController.abort()
    },[])


    let data=PDFs.filter((data)=>{
        if(data.courseCode.indexOf(props.searchString2.toLowerCase())===-1){
            return '';
        }
        else{
            return(
                <div key={data.name} className=".mainBody-sub-filler">
                    <div className='PDF'>
                          <a target="_blank" rel="noreferrer" className="fillerImg"   href={data.driveURL}>
                                <h2>PDF</h2>
                                <p>DOWNLOAD</p>
                                <FileDownloadTwoToneIcon/>
                                <h5>{data.courseCode}</h5>
                          </a>
                    </div>
                </div>
            )
        }
    
    })

    
    data=data.map((data)=>{

            return(
                <div key={data.name} className=".mainBody-sub-filler">
                    <div className='PDF'>
                          <a target="_blank" rel="noreferrer" className="fillerImg"   href={data.driveURL}>
                                <h2>PDF</h2>
                                <p>DOWNLOAD</p>
                                <FileDownloadTwoToneIcon/>
                                <h5>{data.courseCode}</h5>
                          </a>
                    </div>
                </div>
            )
    
    })


    return(
            <div className="mainBody-container-filler" id="filler">
                <div className="mainBody-filler">
                {loaderStatus?<h4 style={{"textAlign":"center","marginTop":"30px"}}>LOADING .... </h4>:data}
                </div>
            </div>
    
    )
}
export default Filler;
