"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import axios from 'axios';

const NewFlashcard = () => {

    const [flashcardData, setflashcardData] = useState({
        que : "",
        ans : ""
    })

  async  function submitHandler(){
    const res = await axios.post('http://localhost:3000/api/queAns', {
      user_id: 1,
      flashcards_id: 1,
      question: flashcardData.que,
      answer: flashcardData.ans
  });
  window.location.reload();
    }

  return (
    <Card 
      className="w-full h-[400px] py-9 flex flex-col  items-center   bg-black border-2 text-yellow-400  border-yellow-400 shadow-lg shadow-yellow-400/50 cursor-pointer overflow-hidden">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Interview Que & Ans 
            </h2>
                 
            <CardContent className="flex-grow flex flex-col space-y-3 items-center justify-center">
            <Input 
            type="text" 
            placeholder="Interview Que :" 
            value={flashcardData.que} 
            onChange={e => setflashcardData({...flashcardData, que: e.target.value })}
            />
            <Input 
            type="text" 
            placeholder="Ans :" 
            value={flashcardData.ans} 
            onChange={e => setflashcardData({...flashcardData, ans: e.target.value })}
            />

            </CardContent>
       
        <Button onClick={submitHandler}> ADD </Button>
    
    </Card>
  );
};

export default NewFlashcard;