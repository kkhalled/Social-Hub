import React from 'react'
import SignHero from '../../components/SignHero/SignHero'
import LogInForm from '../../components/LogInForm/LogInForm'

export default function LogIn() {
  return <>
   
   <div className="grid grid-cols-2">
    
    <SignHero title={"Welcome back ,  "} titleMin={" to Social Hub"} text={"Happy to see you again"} />
    <LogInForm/>
   </div>
  
  </>
}
