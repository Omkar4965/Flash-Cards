"use client";
import React, { useEffect, useState } from 'react';
import Flashcard from "@/app/components/flashcard";
import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import NewFlashcard from './components/newFlashcard';
import axios from 'axios';

export default function Home() {
  const [flashcardData, setFlashcardData] = useState([]);
  const [user_id, setUserId] = useState(1);
  const [flashcards_id, setFlashcardsId] = useState(1);
  

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:3000/api/queAns');
      console.log(res.data);
      setFlashcardData(res.data);
    }
    fetchData();
  },[]);

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection :  any) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentIndex = ((page % flashcardData.length) + flashcardData.length) % flashcardData.length;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-12">Flashcards</h1>
      
      <div className="relative w-full max-w-lg h-[450px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={{
              enter: (direction) => ({
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.5,
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1,
                scale: 1,
              },
              exit: (direction) => ({
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
                scale: 0.5,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-full"
          >
            {/* <NewFlashcard/> */}
            <Flashcard
              question={flashcardData[currentIndex]?.question}
              answer={flashcardData[currentIndex]?.answer}
            />
          </motion.div>
        </AnimatePresence>
        <Button 
          variant="ghost" 
          className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 text-yellow-400 p-2 hover:bg-yellow-400/20"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <Button 
          variant="ghost" 
          className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 text-yellow-400 p-2 hover:bg-yellow-400/20"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
      <div className="mt-8 flex space-x-2">
        
        {flashcardData.map((_, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-yellow-400' : 'bg-yellow-400/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}