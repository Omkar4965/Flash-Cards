"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios";
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