import React, { useEffect, useState } from 'react';

function Home()
{

    const [allThePosts,setAllThePosts]=useState([]);
    // var flag=1;

    useEffect(()=>{
        fetch('/allposts',{
            // method:"get",
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then((data)=>{                         // this is an array
            // console.log(typeof(data));
            setAllThePosts(data);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

    function LikePost(postId)
    {
        fetch('/likepost',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt") 
            },
            body:JSON.stringify({
                postId,
            })
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data);
            const newData=allThePosts.map(item=>{
                if(item._id === data._id)
                    return data;
                else   
                    return item;
            })

            setAllThePosts(newData);
            // flag+=1;
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function UnlikePost(postId)
    {
        fetch('/unlikepost',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
            })
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data);
            // flag+=1;
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function DeletePost(postId)
    {
        fetch(`/delete/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then((data)=>{
            console.log(data)
            const newData=allThePosts.map(item=>{
                    if(item._id !== data._id)
                        return item
                    return data
            })
            setAllThePosts(newData);
            // flag+=1;
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function makeComment(comment,postId)
    {
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                commentBody:comment,
                postId,
            })
        })
        .then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            const newData=allThePosts.map(item=>{
                if(item._id === data._id)
                    return data
                else    
                    return item
            })
            setAllThePosts(newData)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function ForkPost(postId)
    {
        fetch('/forkpost',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
        })
    }

    return (
        <div>
            {
                allThePosts.map(item=>{
                    // console.log("alltheposts");
                    // console.log(item)
                    return(
                        // <li><h2>{item.title}</h2></li>
                        // <li><h2>{item.body}</h2></li>
                        <div className="card">
                            <h2>{item.title}</h2>
                            <h2>{item.body}</h2>
                            <h4>{item.likes.length} likes</h4>

                            <button 
                            className="btn"
                            onClick={()=>{
                                LikePost(item._id)
                            }}
                            >Like</button>

                            <button 
                            className="btn"
                            onClick={()=>{
                                UnlikePost(item._id)
                            }}
                            >Unlike</button>
                            
                            <button 
                            className="btn"
                            onClick={()=>{
                                DeletePost(item._id)
                            }}
                            >Delete</button>
                            
                            <button 
                            className="btn"
                            onClick={()=>{
                                ForkPost(item._id)
                            }}
                            >Fork</button>

                            <h4>Previous Comments</h4>
                            <div>
                                {
                                    item.comments.map(userComment=>{
                                        // console.log(userComment)
                                        return(
                                            <h6>
                                                <span style={{fontWeight:"600"}}>{userComment.commentedBy.name}</span> {userComment.commentBody}
                                            </h6>   
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <form onSubmit={(e)=>{
                                    makeComment(e.target[0].value , item._id);
                                    e.preventDefault();     //when we submit forms, the page automatically gets reloaded
                                }}>                         
                                    <input                  //to prevent that reloading, we have used e.preventDefault()
                                    type="text"
                                    placeholder="comments"
                                    />
                                </form>
                            </div>

                        </div>
                    )
                })
            }
            <h1>this is Home</h1>
        </div>
    );
}

export default Home;
