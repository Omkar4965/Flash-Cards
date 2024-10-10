"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { X } from 'lucide-react';

const NewFlashcard = ({onAddNew, settAddnew}) => {
  const {userId} =  useUser()
  const [flashcardData, setflashcardData] = useState({
    que: "",
    ans: ""
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  async function submitHandler() {
    try {
       onAddNew(flashcardData.que, flashcardData.ans)
    } catch (error) {
      console.error("Error creating new flashcard:", error);
    }
  }

  return (
    <motion.div
      className="w-full h-[400px] p-6 bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 rounded-xl flex flex-col justify-center items-center"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Button
        className="absolute top-2 right-2 hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400"
        onClick={() => settAddnew(false)}
      > <X  className="w-5 h-5" /> </Button>

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">
        Add Q&A
      </h2>

      

      <div className="w-full max-w-md space-y-4">
        <Input
          type="text"
          placeholder="Question"
          className="w-full text-white bg-black border rounded-xl border-yellow-400 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 p-3"
          value={flashcardData.que}
          onChange={(e) => setflashcardData({ ...flashcardData, que: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Answer"
          className="w-full text-white bg-black border rounded-xl border-yellow-400 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 p-3"
          value={flashcardData.ans}
          onChange={(e) => setflashcardData({ ...flashcardData, ans: e.target.value })}
        />
      </div>

      <Button
        className="mt-6 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 border border-yellow-400 hover:shadow-lg transform hover:scale-105 transition duration-200"
        onClick={submitHandler}
      >
        Add Flashcard
      </Button>
    </motion.div>
  );
};

export default NewFlashcard;
