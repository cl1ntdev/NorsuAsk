import React, { useState} from "react";

export default function Chat(){
  const [userMessage,setUserMessage] = useState<string>("")
  
  const handleHistory = () =>{
    console.log("working")
  }
  return(
    <div className="flex flex-col h-screen w-screen bg-amber-700">
      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto"> 
        <p className="text-zinc-950 bg-amber-300">Testing</p>
      </div>
      
      {/* ========= */}
      {/* CHAT AREA */}
      {/* ========= */}
      
      <div className="flex items-center justify-center mb-5">
        <input className="mx-5" type="text" placeholder="Ask Norsu Ai" value={userMessage} />
        <button className="mx-5" onClick={handleHistory}>Send</button>
      </div>
    </div>
  )
}