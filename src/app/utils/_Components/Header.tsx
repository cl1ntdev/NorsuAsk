import React from "react"

type pageStatus = {
  changePageStatus:(value:string) => void
}
// pass the value using prop first(child) then to the parent file

const Header = ({changePageStatus}:pageStatus) =>{
  return(
    <div className="justify-center">
      <button onClick={()=>changePageStatus("Question")} className="mx-4 mt-5 bg-amber-50 text-blue-600">Qustion</button>
      <button onClick={()=>changePageStatus("About")} className="mx-4 mt-5  bg-amber-50 text-blue-600">About</button>
    </div>
  )
}



export {Header}