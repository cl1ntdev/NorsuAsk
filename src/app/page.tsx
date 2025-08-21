'use client'

import React, { useEffect } from "react";
import { Header } from "./utils/_Components/Header";
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
    <div className="flex justify-center align-middle bg-red-500 pt-2">
      <Header changePageStatus={handleChangePage} />
      <a>{page}</a>
    </div>
  );
}
