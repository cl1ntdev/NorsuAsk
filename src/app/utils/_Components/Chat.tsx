import React, { useState} from "react";

export default function Chat(){
  const [userMessage,setUserMessage] = useState<string>("")
  
  const handleHistory = () =>{
    console.log("working")
  }
  return(
    <div>
      
      <div>
        <input type="text" placeholder="Ask Norsu Ai" value={userMessage} />
        <button onClick={handleHistory}>Send</button>
      </div>
    </div>
  )
}