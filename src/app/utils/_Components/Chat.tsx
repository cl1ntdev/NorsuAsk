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
      message:"Hello I am Norsu Inquiry AI, Ask anything you want to know"
    },
  ])
  
  const sendMessage = async() =>{
    if (!userMessage.trim()){
      console.log('empty input')
      return;
    }
    
    // >> >> USER SENDING MESSAGE << << //
    const userChat:ChatType = {
      sender:"user",
      message:userMessage
    }
    setUserMessage("") // reset after sendin a message
    setChat(prev => [...prev,userChat])
    
    // >> >> AI RESPONDING MESSAGE << << //
    const responseFromServer = await fetch("http://localhost:8080/api/chat",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({message:userMessage})
    })
    
    const ai_response = await responseFromServer.json()
    console.log(ai_response)
    const aiMessage:ChatType = {
      sender:"ai",
      message: ai_response.reply
    }
    setChat(prev => [...prev,aiMessage])
    
    
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
        <input className="mx-5" type="text" placeholder="Ask Norsu Ai" value={userMessage} 
        onChange={(e)=>setUserMessage(e.target.value)} />
        <button className="mx-5" onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}