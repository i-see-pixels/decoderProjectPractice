import react, { useEffect, useState } from 'react';

function ForkedPost()
{
    const [myforks,setMyforks]=useState([]);

    useEffect(()=>{
        fetch('/getforkpost',{
            method:"get",
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then((data)=>{
            // console.log(data);
            setMyforks(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    },[])

    function UnforkPost(postId)
    {
        fetch('/unforkpost',{
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
            console.log(data)
            console.log("unforked successfully")
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return(
        <div>
            {
                myforks.map(item=>{
                    return(
                        <div className="card">
                            <h1>{item.title}</h1>
                            <h2>{item.body}</h2>
                            <h5>{item.likes.length} likes</h5>

                            <button 
                            className="btn"
                            onClick={()=>{
                                UnforkPost(item._id)
                            }}>
                                Unfork
                            </button>

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
                        </div>
                    )
                })
            }
            <h1>Forked page</h1>
        </div>
    )
}

export default ForkedPost;