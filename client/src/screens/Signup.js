import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';

function Signup()
{
    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const history=useHistory();

    function PostData()
    {
        fetch('/signup',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password
            })
        })
        .then(res=>res.json())
        .then((res2)=>{
            console.log(res2)
            history.push("/signin");
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        <div>
            <div className="mycard">
                <div className="card auth-card">
                    <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={
                        function(event)
                        {
                            // console.log(event)
                            // console.log(event.target.value)
                            setName(event.target.value);
                        }
                    }
                    />
                </div>  
                <div className="card auth-card">
                    <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={
                        function(event)
                        {
                            // console.log(event)
                            // console.log(event.target.value)
                            setEmail(event.target.value);
                        }
                    }
                    />
                </div>  
                <div className="card auth-card">
                    <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={
                        function(event)
                        {
                            // console.log(event)
                            // console.log(event.target.value)
                            setPassword(event.target.value);
                        }
                    }
                    />
                </div>  
            </div>

            <button
            className="btn"
            onClick={()=>{
                PostData();
            }}>
                Submit
            </button>
        </div>
    );
}

export default Signup;