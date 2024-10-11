"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, FilePlus, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import NewFlashcard from './newQueAns';
import { LoaderCircle } from 'lucide-react';

interface AttractiveFlashcardProps {
  question: string;
  answer: string;
  onAddNew: (question: string, answer: string) => Promise<void>;
  onDelete: (question: string, answer: string) => Promise<void>;
  addNew: boolean;
  settAddnew: React.Dispatch<React.SetStateAction<boolean>>;
  handleSavequeAns: (question: string, answer: string, newquestion: string, newAnswer: string) => Promise<void>;
}

const AttractiveFlashcard: React.FC<AttractiveFlashcardProps> = ({
  question,
  answer,
  onAddNew,
  onDelete,
  addNew,
  settAddnew,
  handleSavequeAns
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState<string>(question);
  const [newAnswer, setNewAnswer] = useState<string>(answer);
  const [isLoading, setIsLoading] = useState(false); // Loading state for saving changes
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for deleting

  const handleFlip = () => {
    if (!isEditing) setIsFlipped(!isFlipped);
  };

  const fileplusHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    settAddnew(!addNew);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true); // Start loading
    try {

      await handleSavequeAns( question, answer , newQuestion , newAnswer);
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
    setIsLoading(false); // Stop loading
  };

  const deleteHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDeleting(true); // Start loading
    try {
      await onDelete(newQuestion, newAnswer);
    } catch (err) {
      console.log("Error while deleting:", err);
    }
    setIsDeleting(false); // Stop loading
  };

  const cardVariants = {
    front: { rotateY: 0, transition: { duration: 0.6 } },
    back: { rotateY: 180, transition: { duration: 0.6 } },
  };

  const cardContent = (side: 'front' | 'back') => (
    <motion.div
      className="absolute w-full h-full flex flex-col p-6 bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 rounded-xl"
      variants={cardVariants}
      initial={side === 'front' ? 'front' : 'back'}
      animate={side === 'front' ? 'front' : 'back'}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-yellow-400">
          {side === 'front' ? 'Question' : 'Answer'}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400"
            onClick={fileplusHandler}
          >
            <FilePlus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400"
            onClick={handleEdit}
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400"
            onClick={deleteHandler}
            disabled={isDeleting} // Disable button when deleting
          >
            {isDeleting ? <LoaderCircle className="animate-spin h-5 w-5 text-yellow-400" /> : <Trash className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-h-full overflow-auto">
          <textarea
            className={`w-full text-white text-2xl font-bold text-center bg-transparent focus:outline-none resize-none ${!isEditing ? 'cursor-pointer' : ''}`}
            readOnly={!isEditing}
            value={side === 'front' ? newQuestion : newAnswer}
            onChange={(e) => (side === 'front' ? setNewQuestion(e.target.value) : setNewAnswer(e.target.value))}
            style={{
              WebkitTextFillColor: 'white',
              caretColor: 'white',
              height: 'auto',
              overflow: 'hidden',
            }}
          />
        </div>
      </div>
      {isEditing && (
        <Button
          className="mt-4 text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
          onClick={handleSave}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? <LoaderCircle className="animate-spin text-yellow-400 h-6 w-6" /> : "Save Changes"}
        </Button>
      )}
      {!isEditing && (
        <p className="text-yellow-400 text-center mt-4">
          Click to flip
        </p>
      )}
    </motion.div>
  );

  return (
    addNew ? <NewFlashcard onAddNew={onAddNew} settAddnew={settAddnew} /> : 
    <div className="w-full h-[400px] perspective-1000 cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!isFlipped ? cardContent('front') : cardContent('back')}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AttractiveFlashcard;
