"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, FormEvent } from 'react'; // Import types
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    
    // Define types for state values
    const [name, setName] = useState<string>(""); 
    const [email, setEmail] = useState<string>(""); 
    const [password, setPassword] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(false); 

    // Define the submit handler with event typing
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setLoading(true);
        try {
            const res = await axios.post(`api/users/auth`, {
                name: name,
                email: email,
                password: password
            });

            if (res) {
                console.log("User registered successfully");
                router.push('/login');
            }
        } catch (err) {
            const error = err as Error;
            console.error("Error during registration:", error);
        }
        setLoading(false);
    };

    // Add typing for onChange event
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-yellow-400">
            <div className="bg-black border border-yellow-500 p-10 max-w-md w-full shadow-2xl rounded-2xl">
                <h1 className="text-4xl font-extrabold mb-8 text-center">Register</h1>
                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-4 rounded-xl border border-yellow-500 bg-black text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="w-full p-4 rounded-xl border border-yellow-500 bg-black text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-4 rounded-xl border border-yellow-500 bg-black text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <Button
                        className="w-full py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-600 transition duration-200"
                        type="submit"
                    >
                        {loading ? <LoaderCircle className="animate-spin text-black" /> : "Register"}
                    </Button>
                </form>
                <div className="flex flex-col justify-center items-center mt-4">
                    <p className="text-sm">Already have an account?</p>
                    <Button
                        className="mt-2 border border-yellow-500 bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-black hover:text-yellow-400 transition duration-200"
                        onClick={() => router.push('/login')}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}
