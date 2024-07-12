import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Price from './components/Price';
import Login from './components/Login';
import Contact from './components/Contact';
import BookingForm from './components/BookingForm';
import AdminService from './components/AdminService';
import MaybeShowNavbar from './components/MaybeShowNavbar';
import MaybeShowAlert from './components/MaybeShowAlert';
import AppointmentList from './components/AppointmentList';
import Signup from './components/Signup';
import { AuthProvider } from './context/AuthContext';
import React, {useState} from 'react';
import Alerts from './components/Alerts';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const App = ()=>{
  const [alert, setAlert] = useState(null);

  const showalert=(message, type)=>{
    setAlert({
      msg: message,
      typ: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 2500);
  }

  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <MaybeShowNavbar>
            <Navbar/>
          </MaybeShowNavbar>
          <MaybeShowAlert>
            <div className="mt-16 pt-2 bg-gray-200"> 
              <Alerts alert={alert}/>
            </div>
          </MaybeShowAlert>
          <Routes>
            <Route exact path="/" Component={Home} />
            <Route exact path="/About" Component={About} />
            <Route exact path="/Price" Component={Price} />
            <Route exact path="/BookingForm" element={<BookingForm showalert={showalert}/>} />
            <Route exact path="/Contact" Component={Contact} />
            <Route exact path="/Contact" Component={Contact} />
            <Route exact path="/AppointmentList" Component={AppointmentList} />
            <Route exact path="/login" Component={Login} />
            <Route exact path="/Signup" Component={Signup} />
            <Route exact path="/AdminService" Component={AdminService} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
