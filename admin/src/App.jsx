import React from 'react';
import Login from './pages/login';
  import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import {AdminContext} from './context/AdminContext'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointment from './pages/Admin/AllApointment';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContex';
import DoctorsList from './pages/Admin/DoctorsList';



const App = () => {
  const {aToken, setAToken}=useContext(AdminContext)
  return aToken? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<> </>}></Route>
                    <Route path='/admin-Dashboard' element={<Dashboard/>}></Route>

          <Route path='/all-apointments' element={<AllApointment/>}></Route>
          <Route path='/add-doctor' element={<AddDoctor/>}></Route>
          <Route path='doctor-list' element={<DoctorsList/>}></Route>


          
        </Routes>
      </div>

    </div>
  ):(
    <>
     <Login />
      <ToastContainer/>
    </>
  )
}

export default App;
