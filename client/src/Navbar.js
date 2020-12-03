import react from 'react';
import { Link, useHistory } from 'react-router-dom';

function Navbar()
{
    const history=useHistory();
    return (
        <div className = "nav-wrapper">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signin">Signin</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/create">Create Post</Link></li>
        <li><Link to="/forked">Forked Posts</Link></li>
        <li>
            <button onClick={()=>{
                localStorage.clear()
                history.push('/signin')
            }}>Logout</button>
        </li>
        </div>
    )
}

export default Navbar;