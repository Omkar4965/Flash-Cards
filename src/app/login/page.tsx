"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/context/UserContext";
import { LoaderCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUserId } = useUser();
  const [credentials, setCredential] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/users', { email: credentials.email, password: credentials.password });
      if (res) {
        console.log("user login successfully", res.data[0].id);
        setUserId(res.data[0].id);
        localStorage.setItem("userId", res.data[0].id);
        router.push('/dashboard');
      } else {
        console.log("user login unsuccessfully");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-yellow-400">
      <div className="bg-black border border-yellow-500 p-10 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center">Login</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-yellow-500 bg-black text-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
              onChange={e => setCredential({ ...credentials, email: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-yellow-500 bg-black text-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
              onChange={e => setCredential({ ...credentials, password: e.target.value })}
            />
          </div>
          <Button
            className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-600 transition duration-200"
            type="submit"
          >
           {loading ? <LoaderCircle className="animate-spin text-black "/> :  "Login"}
          </Button>
        </form>

        <div className="flex flex-col justify-center items-center mt-4">
          <p className="text-sm text-yellow-400">Don't have an account?</p>
          <Button
            className="mt-2 border border-yellow-500 bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-black hover:text-yellow-400 transition duration-200"
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
