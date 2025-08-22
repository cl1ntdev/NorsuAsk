'use client'

import React, { useEffect } from "react";
import { Header } from "./utils/_Components/Header";
import Chat from "./utils/_Components/Chat";
import { useState } from "react";


export default function Home() {
  const [page, setPage] = useState<string>("Question")
  const handleChangePage = (value:string) =>{
    setPage(value)
  }
  
  useEffect(()=>{
    console.log(page)
  },[page])
  
  return (
    <div className="flex flex-col items-center h-screen bg-white">
      <Header changePageStatus={handleChangePage} />
      <Chat />
    </div>
  );
}
