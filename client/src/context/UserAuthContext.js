import { createContext, useContext, useEffect,useState } from "react";

import axios from '../api/axiosAPI';

const userAuthContext = createContext();
const URL ={
    'AD':'auth/user',
    'CO':'auth/contractor'
}
export const UserAuthContextProvider = ({ children }) => {

    const [auth, setAuth] = useState(null);
    const [loading, setloading] = useState(false)

    const logIn = async (email, password,loginRole) => {
        const LOGIN_URL = URL[loginRole]+'/login';


        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log("response data", response.data);
            //console.log("accesstoken", response.data.accessToken);
                    
            //helper function
            await getCurrentUser(response?.data.accessToken,loginRole);

            return auth;
        } catch (err) {
            if (!err?.response)
                return "No server response";
            else if (err.response?.status === 400)
                return "Invalid Credentials"
        }
    }


    const logOut = async () => {

        const LOGOUT_URL = URL[auth?.roles]+'/logout';
        localStorage.clear();
        console.log("logging out")
        try {
            const response = await axios.get(LOGOUT_URL,

                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setAuth(null);
        } catch (err) {
            if (!err?.response)
                return "No server response";
            else if (err.response?.status === 400)
                return "Invalid Credentials"
        }
    }



    const getCurrentUser = async (accessToken,loginRole) => {
        const CURRENTUSER_URL = URL[loginRole]+'/currentuser';
        try {
            const currentUser = await axios.get(CURRENTUSER_URL,

                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${accessToken}`
                    },
                    withCredentials: true,
                });
            //console.log("currentuser", currentUser);
            const authData={ "user": { "email": currentUser?.data.email, "name": currentUser?.data.name}, "roles": currentUser?.data.role , "accessToken": accessToken }
            setAuth(authData);
            localStorage.setItem('auth',JSON.stringify(authData));
            //console.log("sadsa")
        } catch (err) {
            //console.log(err)
            if (!err?.response)
                return "No server response";
            else if (err.response?.status === 400)
                return "Invalid Credentials"
        }
    }

    const check = async () => {
        const REFRESH_URL =  URL[auth?.roles]+'/refresh';
        if (localStorage.getItem('auth')){
            setAuth(JSON.parse(localStorage.getItem('auth')))
        }
        //console.log("check")
        try {
            const response = await axios.get(REFRESH_URL,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });
            //console.log("response", response.data)

            //helper function
            await getCurrentUser(response?.data.accessToken);

        } catch (err) {
            //console.log(err)
            if (!err?.response)
                return "No server response";
            else if (err.response?.status === 400)
                return "Invalid Credentials"
        }
    }
    useEffect(() => {
        setloading(true);
        check();
        setloading(false);
    }, []);

    return (
        <userAuthContext.Provider value={{
            auth,logIn, logOut,loading
        }}>
            {children}
        </userAuthContext.Provider>
    );
};



//instead of creating useContext in every component , we import it from this UserAuthContext
export const useUserAuth = () => {
    return useContext(userAuthContext);
}