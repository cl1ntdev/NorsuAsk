import React, { useState} from "react";
import { useAuth } from "../Hooks/AuthHook";

export default function LoginPage(){
  const {login} = useAuth()
  const [user,setUser] = useState<string>("")
  const [pass,setPass] = useState<string>("")
  
  const handleLogin = () =>{
    const newUser = {
      "username":user,
      "password":pass
    } 
    login(newUser);
  }
  return(
    <div>
      <input onChange={(e)=>setUser(e.target.value)} className="text-black" placeholder="Enter Username" />
      <input onChange={(e)=>setPass(e.target.value)} className="text-black" placeholder="Enter Pass" />
      <button onClick={handleLogin} className="text-black">Submit</button>
    </div>
  )
}