import { Routes,Route } from "react-router-dom";
import Register from '../pages/Register'
import Login  from "../pages/Login";
import Dashboard from "../pages/Dashboard";


function routing(){
    return (
        <Routes>
          {/* Public routes */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
    );
}

export default routing;