'use client'

import React, { ReactNode,useEffect } from "react";
import { Header } from "./utils/_Components/Header";
import Chat from "./utils/_Components/Chat";
import { useState } from "react";
import LoginPage from "./utils/Page/LoginPage";

export default function Home() {
  const [page, setPage] = useState<ReactNode>(<LoginPage/>)
  const handleChangePage = (value:ReactNode) =>{
    setPage(value)
  }
  
  useEffect(()=>{
    console.log(page)
  },[page])
  
  return (
    <div className="flex flex-col items-center h-screen bg-white">
      <Header changePageStatus={handleChangePage} />
      {page}
    </div>
  );
}
