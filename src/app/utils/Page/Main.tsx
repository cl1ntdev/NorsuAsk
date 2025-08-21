'use client'

import React from "react"
import { Header } from "./Default"
import { useState } from "react"
// import { useState } from "react"

export default function Main(){
  const [state,setState] = useState<string>()
  
  return(
    <div className="bg-green-500">
      <Header />
    </div>
  )
}
