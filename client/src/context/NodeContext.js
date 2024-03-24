import { createContext, useContext } from "react";

import axios from '../api/axiosAPI';
import { useUserAuth } from "./UserAuthContext";

const nodeContext = createContext();

export const NodeContextProvider = ({ children }) => {
    const {user} = useUserAuth();
    
    const getAll =async()=>{
        const GETREPORT_URL = '/node/all';
        try {
            const response = await axios.get(GETREPORT_URL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user?.accessToken}`
                    },
                    withCredentials: true,
                });

            console.log("Report response",response)
            return response
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <nodeContext.Provider value={{
            getAll
        }}>
            {children}
        </nodeContext.Provider>
    );
};



//instead of creating useContext in every component , we import it from this UserAuthContext
export const useNode = () => {
    return useContext(nodeContext);
}