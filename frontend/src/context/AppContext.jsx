import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = '$';
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [doctorsData, setDoctorsData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/patient/doctors');
            if (data.success) {
                setDoctorsData(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error fetching doctors data:', error);
            toast.error('Failed to fetch doctors data. Please try again later.');
        }
    };

    const loaduserProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + '/api/user/get-profile', {
                headers: {
                    token,
                },
            });

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error fetching user profile data:', error);
            toast.error('Failed to fetch user profile. Please try again later.');
        }
    };

    const value = {
        doctors: doctorsData,
        doctorsData,
        setDoctorsData,
        currencySymbol,
        backendURL,
        backendUrl: backendURL,
        token,
        setToken,
        userData,
        setUserData,
        getDoctorsData,
        loaduserProfileData,
        loadUserProfileData: loaduserProfileData,
    };

    useEffect(() => {
        getDoctorsData();
    }, [backendURL]);

    useEffect(() => {
        if (token) {
            loaduserProfileData();
        } else {
            setUserData(false);
        }
    }, [token, backendURL]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
