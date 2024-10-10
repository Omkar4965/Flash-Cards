"use client";
import React, { useEffect, useState } from 'react';
import AttractiveFlashcard from '@/app/components/queAns';
import { ArrowLeft, ChevronLeft, ChevronRight, LoaderCircle, User } from 'lucide-react'; // Import User icon
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUser } from '@/app/context/UserContext';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { PulseLoader } from 'react-spinners';

export default function FlashcardTopicPage() {
  const params = useParams();
  const { userId } = useUser();
  const flashcards_id = params.flashcardTopicsId;
  console.log("flashcards_id : ",flashcards_id)
  const router = useRouter();
  const [flashcardData, setFlashcardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error, setError] = useState(null);
  const [flashTopic, setFlashTopic] = useState("");
  const [logout, showlogout] = useState(false);
  const [addNew, settAddnew] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem('userId')
    router.push('/login')
}

async function submitHandler(que, ans) {
  try {
    
    const res = await axios.post('http://localhost:3000/api/queAns', {
      user_id: userId,
      flashcards_id: flashcards_id,
      question: que,
      answer: ans,
    });
    settAddnew(false);  

    flashcardData.push({
      user_id: userId,
      flashcards_id: flashcards_id,
      question: que,
      answer: ans,
    });
    paginate(1)
    console.log("res : ",res)
  } catch (error) {
    console.error("Error creating new flashcard:", error);
  }
}

const deleteHandler = async (que, ans)=>{
  
  try{
    const res = await axios.delete("http://localhost:3000/api/queAns", {
      params: {
        user_id: userId,
        flashcards_id: flashcards_id,
        question: que,
        answer: ans,
      }
  });
    setFlashcardData( flashcardData.filter(flash => flash.question != que && flash.answer != ans))
    paginate(1)
    console.log("fres : ",flashcardData)

  }catch(err){
    console.log("err while deleting : ",err)
  }
  console.log("deleteHandler")
}

  useEffect(() => {
    async function fetchData() {
      if (!userId || !flashcards_id) return;
      setLoading2(true)
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/queAns?user_id=${userId}&flashcards_id=${flashcards_id}`);
        const res2 = await axios.get(`http://localhost:3000/api/flashcards?user_id=${userId}`);
        setFlashcardData(res.data);
        if (!res.data.length){ settAddnew(true);}
        setFlashTopic(res2.data.filter(flash => flash.id == flashcards_id)[0].flashcardtopics);

        setError(null);
      } catch (error) {
        console.error("Error fetching flashcard data:", error);
        setError("Failed to fetch flashcard data. Please try again.");
      } finally {
        setLoading(false);
        setLoading2(false)
      }
    } 

    if (userId) {
      fetchData();
    }else{
        router.push('/login')
    }

  }, [userId, flashcards_id]);

  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection) => setPage([page + newDirection, newDirection]);
  const currentIndex = ((page % flashcardData.length) + flashcardData.length) % flashcardData.length;

  if (loading) return <div className="min-h-screen bg-black"><LoaderCircle/></div>;
  if (error) return <p className="text-red-500">{error}</p>;
  

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <AnimatedBackground />
      
      <h1 className="text-6xl font-bold text-yellow-400 mb-12 tracking-wider">{flashTopic}</h1>
      
      {/* User Icon */}
      <ArrowLeft className="absolute top-4 left-6 h-10 w-11 hover:bg-yellow-400 hover:text-black rounded-full text-yellow-400 p-2" onClick={() => router.push('/dashboard')} />
      <div className="absolute top-4 right-6 flex flex-col items-center space-x-2 hover:cursor-pointer">
                <User className="h-8 w-8 text-yellow-400" onClick={() => {showlogout(!logout)}} />
              {  logout &&  <Button className="text-yellow-400 text-2xl font-bold" onClick={logoutHandler}>Logout</Button>}
        </div>
      
      <div className="relative w-full max-w-lg h-[450px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={{
              enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0, scale: 0.5 }),
              center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
              exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0, scale: 0.5 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute w-full"
          >
             {   loading2 ? <PulseLoader size={15} color={"#FACC15"} /> : 
            <AttractiveFlashcard
              question={flashcardData[currentIndex]?.question}
              answer={flashcardData[currentIndex]?.answer}
              onAddNew={(que, ans) => { submitHandler(que, ans) }}
              onDelete={(que, ans) => { deleteHandler(que, ans) }}
              addNew = {addNew} 
              settAddnew = {settAddnew}
            />
          }
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
}

const AnimatedBackground = () => {
  return (
      <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
              <motion.div
                  key={i}
                  className="absolute bg-yellow-400/10"
                  style={{
                      width: "0.2vmax",  // Narrower width for the lines
                      height: "20vmax",  // Keeping the height of the lines
                      borderRadius: "1vmax", // Rounded edges
                      top: `${Math.random() * 100}%`, // Random starting position vertically
                      left: `${Math.random() * 100}%`, // Random starting position horizontally
                  }}
                  animate={{
                      top: ["-20%", "120%"], // Falling from above the screen to below
                  }}
                  transition={{
                      duration: Math.random() * 5 + 5, // Fall speed varies between 5 to 10 seconds
                      repeat: Infinity,
                      ease: "linear",
                  }}
              />
          ))}
      </div>
  );
};
