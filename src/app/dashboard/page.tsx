"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Pencil, Check, User, X } from "lucide-react"; // Import User icon
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { LoaderCircle } from "lucide-react";

// Define types for Flashcards
interface Flashcard {
  id: string;
  flashcardtopics: string;
}

const Dashboard: React.FC = () => {
  const { userId } = useUser();
  const router = useRouter();
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); // Type the state
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [flashcardtopics, setflashcardtopics] = useState<string>("");
  const [flashquestion, setFlashquestion] = useState<string>("");
  const [flashanswer, setFlashanswer] = useState<string>("");
  const [editingFlashId, setEditingFlashId] = useState<string | null>(null);
  const [editTopic, setEditTopic] = useState<string>("");
  const [isEditing, setisEditing] = useState<boolean>(false);
  const [logout, showlogout] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/flashcards?user_id=${userId}`);
        setFlashcards(res.data);
        console.log("res.data : ", res.data);
      } catch (err) {
        console.error("Error fetching flashcards:", err);
      }
      setLoading(false);
    };

    if (userId) {
      fetchFlashcards();
    } else {
      router.push("/login");
    }
  }, [userId, router]);

  const createHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!flashcardtopics || !flashquestion || !flashanswer) {
      console.warn("Please fill out all fields.");
      return;
    }

    setLoading2(true);
    try {
      const res = await axios.post<{ id: string }>(`${process.env.NEXT_PUBLIC_URL}/api/flashcards?user_id=${userId}`, {
        flashcardtopics,
      });
      const res2 = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/queAns`, {
        user_id: userId,
        flashcards_id: res.data.id,
        question: flashquestion,
        answer: flashanswer,
      });

      if (res && res2) {
        setFlashcards((prev) => [...prev, { id: res.data.id, flashcardtopics }]);
        setflashcardtopics("");
        setFlashquestion("");
        setFlashanswer("");
        setShowCreateForm(false);
      }
    } catch (err) {
      console.error("Error creating flashcard:", err);
    }
    setLoading2(false);
  };

  const saveEditHandler = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (!editTopic) return;

    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_URL}/api/flashcards`, {
        user_id: userId,
        flashcardtopics: editTopic,
        flashcardtopicsId: id,
      });

      if (res) {
        setFlashcards((prev) =>
          prev.map((flash) => (flash.id === id ? { ...flash, flashcardtopics: editTopic } : flash))
        );
        setEditingFlashId(null);
        setisEditing(!isEditing);
      }
    } catch (err) {
      console.error("Error updating flashcard:", err);
    }
  };

  const deleteHandler = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL}/api/flashcards?user_id=${userId}&id=${id}`);
      if (res) {
        setFlashcards((prev) => prev.filter((flash) => flash.id !== id));
      }
    } catch (err) {
      console.error("Error deleting flashcard:", err);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-yellow-400 p-6 font-sans bg-animation relative">
      <AnimatedBackground />
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wider">Flashcards</h1>
      <div className="absolute top-4 right-6 flex flex-col  items-center space-x-2 hover:cursor-pointer">
        <User className="h-8 w-8 text-yellow-400" onClick={() => showlogout(!logout)} />
        {logout && <Button className="text-yellow-400 text-2xl font-bold" onClick={logoutHandler}>Logout</Button>}
      </div>

      {loading ? (
        <PulseLoader size={15} color={"#FACC15"} />
      ) : (
        <div className="grid justify-center items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {flashcards.map((flash) => (
            <Card
              key={flash.id}
              className="bg-black border-2 min-w-[350px] border-yellow-400 shadow-lg shadow-yellow-400/50 cursor-pointer relative h-60 transition-all duration-300 ease-in-out hover:scale-105"
              onClick={() => !isEditing && router.push(`/dashboard/${flash.id}`)}
            >
              <CardContent className="p-6 flex items-center justify-center h-full relative">
                {editingFlashId === flash.id ? (
                  <Input
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    className="text-3xl font-bold text-center leading-tight text-yellow-400 border-none"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-center leading-tight text-yellow-400">{flash.flashcardtopics}</h2>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {editingFlashId === flash.id ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-yellow-400 hover:text-black rounded-full transition-colors duration-300"
                      onClick={(e) => saveEditHandler(e, flash.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-yellow-400 hover:text-black rounded-full transition-colors duration-300"
                      onClick={(e) => {
                        setisEditing(true);
                        e.stopPropagation();
                        setEditingFlashId(flash.id);
                        setEditTopic(flash.flashcardtopics);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => deleteHandler(flash.id, e)}
                    className="hover:bg-yellow-400 hover:text-black rounded-full transition-colors duration-300"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateForm ? (
        <Card className="fixed bottom-8 right-8 left-8 bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 text-yellow-400 max-w-md mx-auto">
          <CardContent className="p-6">
        <X className="text-yellow-400  transition-all duration-300 top-3 right-3 absolute size-8 p-1 hover:text-black hover:bg-yellow-400 rounded-full "  onClick={() => setShowCreateForm(false)}/>
            <h2 className="text-3xl font-bold mb-6 text-center">{flashcardtopics === "" ? "New Flashcard" : flashcardtopics}</h2>
            <div className="space-y-4">
              <Input
                placeholder="Flashcard Topic"
                value={flashcardtopics}
                onChange={(e) => setflashcardtopics(e.target.value)}
                className="bg-black border-yellow-400 text-yellow-400"
              />
              <Input
                placeholder="Flashcard Question"
                value={flashquestion}
                onChange={(e) => setFlashquestion(e.target.value)}
                className="bg-black border-yellow-400 text-yellow-400"
              />
              <Input
                placeholder="Flashcard Answer"
                value={flashanswer}
                onChange={(e) => setFlashanswer(e.target.value)}
                className="bg-black border-yellow-400 text-yellow-400"
              />
              <Button
                onClick={createHandler}
                className="bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 border-yellow-400 w-full"
              >
                {loading2 ? <LoaderCircle className="animate-spin" /> : "Create"}
              </Button>
           
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setShowCreateForm(true)}
          className="fixed bottom-8  right-8 p-5 bg-yellow-400 hover:scale-125 text-black rounded-full  hover:bg-black hover:text-yellow-400 transition-all duration-300"
        >
          <Plus className="h-6 w-6 hover:scale-125" />
        </Button>
      )}
    </div>
  );
};

// AnimatedBackground component can stay unchanged

export default Dashboard;


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