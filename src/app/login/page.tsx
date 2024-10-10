"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/context/UserContext";

export default function loginPage() {
  const router = useRouter();
  const {setUserId} = useUser();
  const [credentials, setCredential] = useState({email : "", password : ""})
  const handleLogin = async (e) => {
    e.preventDefault();
    try{
    
      const res = await axios.post('http://localhost:3000/api/users', {email : credentials.email, password : credentials.password});
      if(res){
        console.log("user login successfully", res.data[0].id)
        setUserId(res.data[0].id);
        localStorage.setItem("userId", res.data[0].id)
        router.push('/dashboard')
      }else{
        console.log("user login unsuccessfully")
      }
    }catch(err){
      console.log(err)
    }
    console.log("login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
      <div className="bg-black border border-yellow-500 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        <form className="space-y-6" onSubmit={e =>  handleLogin(e)}>
          <div>
            <Input 
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded border border-yellow-500 bg-black text-yellow-400" 
              onChange={e => {setCredential( {...credentials, email : e.target.value})}}
            />
          </div>
          <div>
            <Input 
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded border border-yellow-500 bg-black text-yellow-400" 
              onChange={e => {setCredential( {...credentials, password : e.target.value})}}
            />
          </div>
          <Button 
            className="w-full bg-yellow-500 text-black p-3 rounded-lg hover:bg-yellow-600"
            type="submit"
          >
            Login
          </Button>
        </form>

        <div className="flex flex-col justify-center items-center mt-2">
          <p >Don't have an account ?</p>
          <Button className="border bg-yellow-400 border-yellow-400 text-black m-2 rounded-xl hover:text-yellow-400" onClick={() => router.push('/register')}> Register </Button>
        </div>
      </div>
    </div>
  );
}
