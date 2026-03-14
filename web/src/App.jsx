import { Route, Routes } from "react-router"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Instructors from "./pages/Instructors"
function App() {


  return (
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/instructors" element={<Instructors/>} /> 
       <Route path="/about" element={<About/>}/>
       <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
    </Routes>
  )
}

export default App
