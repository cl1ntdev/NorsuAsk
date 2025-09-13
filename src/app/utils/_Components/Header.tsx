import React, { ReactNode,useEffect } from "react";
import LoginPage from "@/app/utils/Page/LoginPage";
type pageStatus = {
  changePageStatus:(value:ReactNode) => void
}
// pass the value using prop first(child) then to the parent file

const Header = ({changePageStatus}:pageStatus) =>{
  return(
    <div className="items-center">
      <div className="justify-center mx-8 mt-2">
        <p className="text-blue-500">NORSU ASK</p>
      </div>
      <div className="justify-center">
        <button onClick={()=>changePageStatus(<LoginPage />)} className="mx-4 mt-5 bg-amber-50 text-blue-600">Login</button>
        <button onClick={()=>changePageStatus("About")} className="mx-4 mt-5  bg-amber-50 text-blue-600">About</button>
      </div>
    </div>
  )
}



export {Header}