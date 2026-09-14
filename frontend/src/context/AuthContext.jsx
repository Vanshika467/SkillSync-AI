import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();// isse hum ek container bana arhe hain jisme dta store karenge or kahi se bhi app mien uss data ko access kar sakte hain 

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);// koi bhi user logged in nhi 
    const [loading, setLoading] = useState(true);// check karna tha ki pegle login haun datasbase mein ya nhi sisiliye loading true
     
    useEffect(() => {// component re render ke baad cgalta hzin side efgect check karega local stoorage mein koi save to nhi 
        const token = localStorage.getItem("accessToken");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));// waapis se string to object mein convert kiya 
        }

        setLoading(false);
    }, []);//[] ek baar chalao jab pehli baar render ho 
    const login = (userData, accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);// context ke state ko update kiya taaki poore app ko pta chal jye user logged in hain 
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
    };
    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };