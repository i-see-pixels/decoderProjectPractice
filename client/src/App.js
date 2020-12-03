import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/Home';
import Signin from './screens/Signin';
import Signup from './screens/Signup';
import CreatePost from './screens/CreatePost';
import ForkedPost from './screens/ForkedPost';
import Navbar from './Navbar';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Navbar />
        <Route exact path="/"><Home/></Route>
        <Route exact path="/signin"><Signin/></Route>
        <Route exact path="/signup"><Signup/></Route>
        <Route exact path="/create"><CreatePost/></Route>
        <Route exact path="/forked"><ForkedPost/></Route>
      </BrowserRouter>
    </div>  
  );
}

export default App;
