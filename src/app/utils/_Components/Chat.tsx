import React, { useState} from "react";

type ChatType = {
  sender: "ai" | "user",
  message: string
}

export default function Chat(){
  const [userMessage,setUserMessage] = useState<string>("")
  
  const [chats,setChat] = useState<ChatType[]>([
    {
      sender:"ai",
      message:"Hello"
    },
    {
      sender:"user",
      message:"World"
    }
  ])
  
  const handleHistory = () =>{
    console.log("working")
  }
  return(
    <div className="flex flex-col h-screen w-screen bg-amber-700">
      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto"> 
        {chats.map((chat,key)=>(
          <div className={`flex ${chat.sender == "ai" ? "justify-start" : "justify-end"} bg-red-500`} key={key}>
            <p>{chat.sender}: {chat.message}</p>
          </div>
        ))}
      </div>
      
      {/* ========= */}
      {/* CHAT AREA */}
      {/* ========= */}
      
      <div className="flex items-center justify-center mb-5">
        <input className="mx-5" type="text" placeholder="Ask Norsu Ai" value={userMessage} onChange={()=>setUserMessage} />
        <button className="mx-5" onClick={handleHistory}>Send</button>
      </div>
    </div>
  )
}