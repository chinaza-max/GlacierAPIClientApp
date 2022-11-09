import React,{useState,useEffect} from 'react';
import {useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import NavDetail from './navdetail';
import Details from "../detailPage/detail-slider";
import "../../../style/details.css";

function Detail(props){
    const[post,setposts]=useState([])
    const[Books,setBooks]=useState([])

    const {name}=useParams();
 
   
   // const isMounted = useRef(false);
    useEffect(()=>{
      
       // isMounted.current = true;

        const init=async ()=>{
            const response=fetch("https://glacier.onrender.com/detail/"+name)
            const body=await response.then(res=>res.json())
            setposts(body.express);
             
            const response2=await fetch("https://glacier.onrender.com/Books");
            const body2=await response2.json();
            setBooks(body2.express);
        }
        init();
 
       // return () => isMounted.current = false;
    },[name])
        return(
                <div  className="firstDetailBody">
                    <NavDetail  history={props.history}  setposts={setposts}/>
                    
                    <div className="detailBodyContainer" id="detailBodyContainer">
                        
                          {post.map((data)=>{
                              return(
                                  <div key={data.name} className="detailBody">
                                      <div className="bookImgContainer"><img  className="bookImg" src={data.driveURL} alt="file cant show"/> </div>
                                      <div className="content"> 
                                      <div><h3 className="color2">{data.title}</h3></div>
                                      <div className="callContainer">
                                          <a   className="call" style={{textDecoration:"none"}} href={"tel:"+data.tel}>call now</a>
                                      </div>
                                      <div className="detailBodyDescription">
                                          <h5 className="color2">Description</h5>
                                          <p className="color">{data.description}</p>
                                      </div>
                                      <div>
                                          <h5 className="color2">Product Details</h5>
                                          <div className="color">
                                              Author  : {data.author}
                                              <br/>
                                              Title : {data.title}
                                              <br/>
                                              Faculty : {data.faculty}
                                              <br/>
                                              Tel : {data.tel}
                                          </div>
                                      </div>
                                      </div>
                                  </div>
                              )

                          })}
                        <Details data={Books} />
                    </div>
                </div>
        )
        //return isMounted;
}
export default Detail;

