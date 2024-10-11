"use client";
import React, { useEffect, useState } from 'react';
import AttractiveFlashcard from '@/app/components/queAns';
import { ArrowLeft, ChevronLeft, ChevronRight, LoaderCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUser } from '@/app/context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

// Define types for state variables and data
interface Flashcard {
  user_id: string;
  flashcards_id: string;
  question: string;
  answer: string;
}

const FlashcardTopicPage: React.FC = () => {
  const params = useParams();
  const { userId } = useUser();
  const flashcards_id = params.flashcardTopicsId as string; // Type assertion for string
  const router = useRouter();

  const [flashcardData, setFlashcardData] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [flashTopic, setFlashTopic] = useState<string>("");
  const [logout, showlogout] = useState<boolean>(false);
  const [addNew, settAddnew] = useState<boolean>(false);

  const logoutHandler = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const submitHandler = async (que: string, ans: string) => {
    try {
      await axios.post(`api/queAns`, {
        user_id: userId,
        flashcards_id,
        question: que,
        answer: ans,
      });
      settAddnew(false);

      setFlashcardData((prevData) => [
        ...prevData,
        {
          user_id: userId!,
          flashcards_id,
          question: que,
          answer: ans,
        },
      ]);
      paginate(1);
    } catch (error) {
      console.error("Error creating new flashcard:", error);
    }
  };

  //for  queans
  const handleSavequeAns = async ( 
        question : string,
        answer : string,
        newQuestion : string,
        newAnswer : string,
   ) => { 
  
    try {

      await axios.put(`api/queAns`, {
        question,
        answer,
        newQuestion,
        newAnswer,
      });
      setFlashcardData((prevData) => prevData.filter((flash) => flash.question !== question && flash.answer !== answer));
      paginate(1);

    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
    
  };


  const deleteHandler = async (que: string, ans: string) => {
    try {
      await axios.delete(`api/queAns`, {
        params: {
          user_id: userId,
          flashcards_id,
          question: que,
          answer: ans,
        },
      });

      setFlashcardData((prevData) => prevData.filter((flash) => flash.question !== que && flash.answer !== ans));
      paginate(1);
    } catch (err) {
      console.log("Error while deleting:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !flashcards_id) return;

      setLoading2(true);
      try {
        setLoading(true);
        const [res, res2] = await Promise.all([
          axios.get(`api/queAns?user_id=${userId}&flashcards_id=${flashcards_id}`),
          axios.get(`api/flashcards?user_id=${userId}`),
        ]);

        setFlashcardData(res.data);
        if (!res.data.length) settAddnew(true);

        setFlashTopic(res2.data.find((flash: { id: string }) => flash.id === flashcards_id)?.flashcardtopics || "");

        setError(null);
      } catch (error) {
        console.error("Error fetching flashcard data:", error);
        setError("Failed to fetch flashcard data. Please try again.");
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      router.push('/login');
    }
  }, [userId, flashcards_id, router]);

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const paginate = (newDirection: number) => setPage([page + newDirection, newDirection]);
  const currentIndex = ((page % flashcardData.length) + flashcardData.length) % flashcardData.length;

  if (loading) return <div className="min-h-screen bg-black"><LoaderCircle /></div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <AnimatedBackground />
      <h1 className="text-6xl font-bold text-yellow-400 mb-12 tracking-wider">{flashTopic}</h1>

      <ArrowLeft
        className="absolute top-4 left-6 h-10 w-11 hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400 p-2"
        onClick={() => router.push('/dashboard')}
      />
      <div className="absolute top-4 right-6 flex flex-col items-center space-x-2 hover:cursor-pointer">
        <User className="h-8 w-8 text-yellow-400" onClick={() => { showlogout(!logout); }} />
        {logout && <Button className="text-yellow-400 text-2xl font-bold" onClick={logoutHandler}>Logout</Button>}
      </div>

      <div className="relative w-full max-w-lg h-[450px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={{
              enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0, scale: 0.5 }),
              center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
              exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0, scale: 0.5 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute w-full"
          >
            {loading2 ? <PulseLoader size={15} color={"#FACC15"} /> : (
              <AttractiveFlashcard
                question={flashcardData[currentIndex]?.question}
                answer={flashcardData[currentIndex]?.answer}
                onAddNew={submitHandler}
                onDelete={deleteHandler}
                addNew={addNew}
                settAddnew={settAddnew}
                handleSavequeAns={handleSavequeAns}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <Button
          variant="ghost"
          className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 text-yellow-400 p-2 hover:bg-yellow-400/20 rounded-full"
          onClick={() => paginate(-1)}
          aria-label="Previous flashcard"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          variant="ghost"
          className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 text-yellow-400 p-2 hover:bg-yellow-400/20 rounded-full"
          onClick={() => paginate(1)}
          aria-label="Next flashcard"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-yellow-400/10"
          style={{
            width: "0.2vmax",
            height: "20vmax",
            borderRadius: "1vmax",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ top: ["-20%", "120%"] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

export default FlashcardTopicPage;
