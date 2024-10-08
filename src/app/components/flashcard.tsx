"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, FilePlus, Trash2 } from 'lucide-react';
import NewFlashcard from './newFlashcard';
import axios from 'axios';
import { Input } from '@/components/ui/input';

const Flashcard = ({ question , answer } ) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [addnew, setAddnew] = useState(false);  
  const [edit, setEdit] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const fileplusHandler = ()=>{
    console.log("fileplusHandler")
    setAddnew(!addnew);
  }
  const editHandler = ()=>{
    console.log("editHandler")
  }
  const deleteHandler = async ()=>{
    try{
      const res = await axios.delete("http://localhost:3000/api/queAns", {
        params: {
            question: question,
            answer: answer
        }
    });
    window.location.reload();
    }catch(err){
      console.log("err while deleting : ",err)
    }
    console.log("deleteHandler")
  }
  return (

    addnew ? <NewFlashcard /> :  <Card 
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
            <div className='flex justify-between items-center'>
            <CardHeader className="text-yellow-400 text-xl font-bold">
              Interviewer:
            </CardHeader>
            <div className='flex'>
            <FilePlus className="w-5 h-5 text-white  mb-4 mr-2" onClick={fileplusHandler}/>
            <Edit className="w-5 h-5 text-white  mb-4  mr-2" onClick={editHandler} />
            <Trash2 className="w-5 h-5 text-white  mb-4  mr-1" onClick={deleteHandler} />
            </div>
            </div>
            <CardContent className="flex-grow flex flex-col items-center justify-center">
              <p className="text-white text-2xl font-bold text-center">{question}</p>
              <Input />
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
              <p className="text-white text-2xl ">{answer}</p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    
    </Card>
  );
};

export default Flashcard;