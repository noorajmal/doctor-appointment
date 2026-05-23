import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const AdminContext = createContext()
const AdminContextProvider = ( props ) => {

const [aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
const [doctors,setDoctors]=useState([])

const backendURL=import.meta.env.VITE_BACKEND_URL
const getAllDoctorsURL=async()=>{

    try {
        const {data}=await axios.post(backendURL+'/api/admin/all-doctors',{},{headers:{aToken}})
        if(data.success){
            setDoctors(data.doctors)
        }
        else{
            toast.error(data.message)
        }
        
    } catch (error) {
        toast.error(error.message) 
    }
}


    const value={
        aToken,setAToken,backendURL,getAllDoctorsURL

    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider