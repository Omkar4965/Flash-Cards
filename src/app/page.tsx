"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@/app/context/UserContext";

export default function Home() {
  const router = useRouter();
  const {userId} = useUser();
  if(userId){
    router.push('/dashboard')
  }else{
    router.push('/login')
  }
  return (
    <></>
  );
}