'use client'

import React from "react";
import { Header } from "./utils/_Components/Header";
import { useState } from "react";


export default function Home() {
  const [page,setPage] = useState<string>("")
  
  return (
    <div className="flex justify-center align-middle bg-red-500 pt-2">
      <Header />
    </div>
  );
}
