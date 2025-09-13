import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  username: string|null,
  password: string|null
}|null

type AuthContextType = {
  user:User,
  login: (userData:User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children: ReactNode})=>{
  const [user,setUser] = useState<User>(null)
  
  // load user from localStorage when app starts
   useEffect(() => {
     const storedUser = localStorage.getItem("user");
     if (storedUser) {
       setUser(JSON.parse(storedUser));
     }
   }, []);
   
  const login = (UserData:User)=>{
    setUser(UserData);
       localStorage.setItem("user", JSON.stringify(UserData));
   }
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>{
  console.log("auth hook checking")
  const context = useContext(AuthContext);
   if (!context) {
     throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
}