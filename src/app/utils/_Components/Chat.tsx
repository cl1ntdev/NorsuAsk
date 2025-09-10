import React, { useState} from "react";

type ChatType = {
  sender: "ai" | "user",
  message: string
}

export default function Chat(){
  const [userMessage,setUserMessage] = useState<string>("")
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [isTxLoaded, setIsTxtLoaded] = useState<boolean>(false);
  
  const [chats,setChat] = useState<ChatType[]>([
    {
      sender:"ai",
      message:"Hello I am Norsu Inquiry AI, Ask anything you want to know"
    },
  ])
  
  const sendMessage = async() =>{
    setIsLoading(true)
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
    // const responseFromServer = await fetch("http://localhost:8080/api/chat",{
    //   method:"POST",
    //   headers:{"Content-Type": "application/json"},
    //   body: JSON.stringify({message:userMessage})
    // })
    
    // const ai_response = await responseFromServer.json()
    // if(ai_response){
    //   setIsLoading(false)
    // }
    // const aiMessage:ChatType = {
    //   sender:"ai",
    //   message: ai_response.reply
    // }
    // >> >> AI RESPONDING MESSAGE << << //
    // >> >> AI with vector database << <<
    if(!isTxLoaded){
      await fetch('http://localhost:8080/load-txt',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"none":"none"})
      })
    } 
    setIsTxtLoaded(true)
    const ai_ask = await fetch('http://localhost:8080/ask',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:userMessage})
    })
    const ai_response = await ai_ask.json()
    setIsLoading(false)
    console.log(ai_response)
    console.log(ai_response.reply)
    // const aiMessage: ChatType = {
    //   sender: "ai",
    //   message: ai_response.reply
    // }
     const aiMessage: ChatType = {
      sender: "ai",
      message: ai_response.reply
    }
    
    setChat(prev => [...prev,aiMessage])
    
    
  }
  return(
    <div className="flex flex-col h-screen w-screen ">
      {/* Chat Box */}
      <div className={`flex-1 overflow-y-auto p-4 h-screen`}>
        {chats.map((chat,key)=>(
          // Container for chat
          <div className={`flex mb-4 ${
            chat.sender == "ai"
            ? "justify-start"
            :
            "justify-end"
            }`} key={key}>
            <div className={`
              max-w-xs
              sm:max-w-md
              p-3
              rounded-lg
              shadow-md
              ${
                chat.sender == "ai"
                ? "bg-gray-200 text-gray-800 rounded-bl-none"
                :
                "bg-blue-500 text-white rounded-br-none"
              }
            `}>
              <p className="font-medium">{chat.sender}:</p>
              <p>{chat.message}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <p className="text-gray-900 text-center italic">Loading...</p>
        )}
      </div>
      
      {/* ========= */}
      {/* CHAT AREA */}
      {/* ========= */}
      
      <div className="flex items-center justify-center mb-5">
        <div className=" bg-gray-400 rounded-2xl py-2">
          <input className="mx-5 p-5 w-3xl text-black" type="text" placeholder="Message" value={userMessage} 
          onChange={(e)=>setUserMessage(e.target.value)} />
          <button className="mx-5 bg-blue-300 rounded-s-sm border text-gray-700 p-4" onClick={sendMessage}>Send</button>  
        </div>
      </div>
    </div>
  )
}