import { createContext, useContext } from "react";

import axios from '../api/axiosAPI';
import { useUserAuth } from "./UserAuthContext";

const contractorContext = createContext();

export const ContractorContextProvider = ({ children }) => {
    const {user} = useUserAuth();
    
    const getAll =async()=>{
        const GETREPORT_URL = '/report';
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

    const deleteReport = async(reportId)=>{
        const DELETEREPORT_URL = '/report/'+reportId;

        try {
            const response = await axios.delete(DELETEREPORT_URL,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user?.accessToken}`
                    },
                    withCredentials: true,
                });

            console.log("Report response",response)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <contractorContext.Provider value={{
            deleteReport,getAll
        }}>
            {children}
        </contractorContext.Provider>
    );
};



//instead of creating useContext in every component , we import it from this UserAuthContext
export const useReport = () => {
    return useContext(contractorContext);
}