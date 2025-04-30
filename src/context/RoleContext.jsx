import { createContext, useContext, useEffect, useState } from "react";
import {doc, getDoc} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();

export const RoleProvider = ({children}) => {
    const { user } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                setRole(userDoc.data()?.role)
            } else {
                setRole(null);
            }
            setLoading(false);
        };

        fetchRole();
    }, [user]); 
    
    return (
        <RoleContext.Provider value={{role, loading}}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);