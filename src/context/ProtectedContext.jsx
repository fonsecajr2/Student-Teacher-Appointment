// src/context/ProtectedContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const ProtectedContext = createContext();

export const ProtectedProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: userData?.name,
          role: userData?.role,
          approved: userData?.approved,
        });
        setRole(userData?.role || null);
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <ProtectedContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </ProtectedContext.Provider>
  );
};

export const useProtected = () => useContext(ProtectedContext);
