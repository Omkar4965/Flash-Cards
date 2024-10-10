"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Pencil, Check, User } from "lucide-react"; // Import User icon
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { userId } = useUser();
    const router = useRouter();
    const [flashcards, setFlashcards] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [flashcardTopics, setFlashcardTopics] = useState("");
    const [flashquestion, setFlashquestion] = useState("");
    const [flashanswer, setFlashanswer] = useState("");
    const [editingFlashId, setEditingFlashId] = useState(null);
    const [editTopic, setEditTopic] = useState("");
    const [isEditing, setisEditing] = useState(false);
    const [logout, showlogout] = useState(false);

    useEffect(() => {
        const fetchFlashcards = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/flashcards?user_id=${userId}`);
                setFlashcards(res.data);
            } catch (err) {
                console.error("Error fetching flashcards:", err);
            }
        };

        if (userId) {
            fetchFlashcards();
        }
    }, [userId]);

    const createHandler = async (e) => {
        e.stopPropagation();
        if (!flashcardTopics || !flashquestion || !flashanswer) {
            console.warn("Please fill out all fields.");
            return;
        }

        try {
            
            const res = await axios.post(`http://localhost:3000/api/flashcards?user_id=${userId}`, {
                flashcardTopics: flashcardTopics
            });
            const res2 = await axios.post('http://localhost:3000/api/queAns', {
                user_id: userId,
                flashcards_id: res.data.id,
                question: flashquestion,
                answer: flashanswer
            });

            if (res && res2) {
                setFlashcards((prev) => [...prev, { id: res.data.id, flashcardTopics }]);
                setFlashcardTopics("");
                setFlashquestion("");
                setFlashanswer("");
                setShowCreateForm(false);
            }
        } catch (err) {
            console.error("Error creating flashcard:", err);
        }
    };

    const saveEditHandler = async (e, id) => {
        e.stopPropagation();
        if (!editTopic) return;

        try {
            const res = await axios.put(`http://localhost:3000/api/flashcards`, {
                user_id: userId,
                flashcardTopics: editTopic,
                flashcardTopicsId: id
            });

            if (res) {
                setFlashcards((prev) =>
                    prev.map((flash) => (flash.id === id ? { ...flash, flashcardTopics: editTopic } : flash))
                );
                setEditingFlashId(null);
                setisEditing(!isEditing);
            }
        } catch (err) {
            console.error("Error updating flashcard:", err);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem('userId')
        router.push('/login')
    }

    const deleteHandler = async (id, e) => {
        e.stopPropagation();
        try {
            const res = await axios.delete(`http://localhost:3000/api/flashcards?user_id=${userId}&id=${id}`);
            if (res) {
                setFlashcards((prev) => prev.filter((flash) => flash.id !== id));
            }
        } catch (err) {
            console.error("Error deleting flashcard:", err);
        }
    };

    return (
        <div className="min-h-screen bg-black text-yellow-400 p-6 font-sans bg-animation relative">
            <AnimatedBackground />
            <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wider">Flashcards</h1>
            <div className="absolute top-4 right-6 flex flex-col items-center space-x-2 hover:cursor-pointer">
                <User className="h-8 w-8 text-yellow-400" onClick={() => {showlogout(!logout)}} />
              {  logout &&  <Button className="text-yellow-400 text-2xl font-bold" onClick={logoutHandler}>Logout</Button>}
               </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {flashcards.map((flash) => (
                    <Card
                        key={flash.id}
                        className="bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 cursor-pointer relative h-60 transition-all duration-300 ease-in-out hover:scale-105"
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
                                <h2 className="text-3xl font-bold text-center leading-tight text-yellow-400">
                                    {flash.flashcardTopics}
                                </h2>
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
                                            setEditTopic(flash.flashcardTopics);
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
            {showCreateForm ? (
                <Card className="fixed bottom-8 right-8 left-8 bg-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 text-yellow-400 max-w-md mx-auto">
                    <CardContent className="p-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">{flashcardTopics == "" ? "New Flashcard" : flashcardTopics }</h2>
                        <div className="space-y-4">
                            <Input
                                placeholder="Flashcard Topic"
                                value={flashcardTopics}
                                onChange={(e) => setFlashcardTopics(e.target.value)}
                                className="bg-black border-yellow-400 text-yellow-400 rounded-xl placeholder-yellow-400/60"
                            />
                            <Input
                                placeholder="First Question"
                                value={flashquestion}
                                onChange={(e) => setFlashquestion(e.target.value)}
                                className="bg-black border-yellow-400 text-yellow-400 rounded-xl placeholder-yellow-400/60"
                            />
                            <Input
                                placeholder="First Answer"
                                value={flashanswer}
                                onChange={(e) => setFlashanswer(e.target.value)}
                                className="bg-black border-yellow-400 text-yellow-400 rounded-xl placeholder-yellow-400/60"
                            />
                            <div className="flex justify-between mt-6">
                                <Button
                                    className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-xl transition-colors duration-300"
                                    onClick={(e) => { createHandler(e) }}
                                >
                                    Create
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-yellow-400 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-colors duration-300"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    className="fixed bottom-8 right-8 rounded-full w-16 h-16 bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-400/50 transition-colors duration-300"
                    onClick={() => setShowCreateForm(true)}
                >
                    <Plus className="h-8 w-8" />
                </Button>
            )}
        </div>
    );
};

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