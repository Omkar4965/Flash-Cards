"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { LoaderCircle, X } from 'lucide-react';

interface NewFlashcardProps {
  onAddNew: (question: string, answer: string) => Promise<void>;
  settAddnew: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewFlashcard: React.FC<NewFlashcardProps> = ({ onAddNew, settAddnew }) => {
  const [loading, setLoading] = useState(false);
  const [flashcardData, setflashcardData] = useState({
    que: "",
    ans: ""
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  async function submitHandler() {
    setLoading(true);
    try {
      await onAddNew(flashcardData.que, flashcardData.ans);
      setflashcardData({ que: "", ans: "" });  // Clear form after submission
    } catch (error) {
      console.error("Error creating new flashcard:", error);
    }
    setLoading(false);
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
      >
        <X className="w-5 h-5" />
      </Button>

      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add Q&A</h2>

      <div className="w-full max-w-md space-y-4">
        <Input
          type="text"
          placeholder="Question"
          className="w-full text-white bg-black border rounded-xl border-yellow-400 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={flashcardData.que}
          onChange={(e) => setflashcardData({ ...flashcardData, que: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Answer"
          className="w-full text-white bg-black border rounded-xl border-yellow-400 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={flashcardData.ans}
          onChange={(e) => setflashcardData({ ...flashcardData, ans: e.target.value })}
        />
      </div>

      <Button
        className="mt-4 text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
        onClick={submitHandler}
        disabled={loading} // Disable button when loading
      >
        {loading ? <LoaderCircle className="animate-spin text-yellow-400 h-6 w-6" /> : "Add Flashcard"}
      </Button>
    </motion.div>
  );
};

export default NewFlashcard;
