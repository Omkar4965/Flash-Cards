"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const Flashcard = ({ question , answer } : any) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <Card 
      className="w-full h-[400px] bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 cursor-pointer overflow-hidden"
      onClick={handleFlip}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <CardHeader className="text-yellow-400 text-xl font-bold">
              Interviewer:
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <p className="text-white text-2xl font-bold text-center">{question}</p>
            </CardContent>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <CardHeader className="text-yellow-400 text-xl font-bold">
              Answer:
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <p className="text-white text-lg">{answer}</p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    
    </Card>
  );
};

export default Flashcard;