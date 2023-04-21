import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/fire-config";


const AuthContext = createContext();
function AuthProvider(props) {
    const [userInfo, setUserInfo] = useState({});
    const [user, setUser] = useState({});
    const values = { userInfo, setUserInfo, user };
    useEffect(() => {
        // user là user mỗi lần createUserWithEmailAndPassword
        const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const colRef = doc(db, "users", user.uid);
                const docSnapshot = await getDoc(colRef);
                if (docSnapshot.data()) {
                    // console.log(docSnapshot.data());
                    setUser(docSnapshot.data())
                }
                setUserInfo(user)
            }
            else {
                setUserInfo(null)
            }
        })
        return () => unregisterAuthObserver()

        // onAuthStateChanged(auth, async (user) => {
        //     setUserInfo(user)
        // })
    }, [])
    return <AuthContext.Provider value={values} {...props}></AuthContext.Provider>
}
function useAuth() {
    const context = useContext(AuthContext);
    if (typeof context === 'undefined') throw new Error('useAuth must be used within AuthProvider')
    return context;
}
export { AuthProvider, useAuth };
