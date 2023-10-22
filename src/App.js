import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";

const App = () => {

    return (
        <>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path='/' element={<Signup />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </Router>
        </>
    )
}

export default App;