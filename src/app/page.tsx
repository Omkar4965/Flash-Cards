"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/context/UserContext";

export default function Home() {
  const router = useRouter();
  const {setUserId} = useUser();
  const [credentials, setCredential] = useState({email : "", password : ""})
  const handleLogin = async () => {
    try{
    
      const res = await axios.post('http://localhost:3000/api/users', {email : credentials.email, password : credentials.password});
      if(res){
        console.log("user login successfully", res.data[0].id)
        setUserId(res.data[0].id);
        localStorage.setItem("userId", res.data[0].id)
      }else{
        console.log("user login unsuccessfully")
      }
    }catch(err){
      console.log(err)
    }
    console.log("login");
  }
  return (
    <div className="h-[100%] flex  justify-center items-center ">
      <div className="flex flex-col justify-center items-center space-y-5 bg-slate-600 h-full w-[30%] p-5">
        <h1>Login</h1>
        <Input placeholder="username" className="m-2 p-2" onChange={e => {setCredential( {...credentials, email : e.target.value})}}/>
        <Input placeholder="password" className="m-2 p-2" onChange={e => {setCredential( {...credentials, password : e.target.value})}}/>
        <Button className="w-10" onClick={handleLogin}>login</Button>

      </div>
    </div>
  );
}