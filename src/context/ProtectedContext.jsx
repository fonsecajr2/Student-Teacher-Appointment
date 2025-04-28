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
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (userDoc.exists()) {
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
            // Se o documento do usuário não existir, loga o erro ou limpa o estado
            console.error("UserDoc not found!");
            setUser(null);
            setRole(null);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário: ", error);
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false); // Certifique-se de que o loading seja atualizado após as verificações.
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
