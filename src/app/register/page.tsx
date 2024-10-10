"use client";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const res = await axios.post('/api/users/auth', {
                name: name,
                email: email,
                password: password
            });

            console.log("hi");

            if (res) {
                console.log("User registered successfully");
                router.push('/login');
            }
        } catch (err) {
            console.error("Error during registration:", err.response?.data || err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
            <div className="bg-black border border-yellow-400 p-8 max-w-md w-full shadow-lg shadow-yellow-400/50 rounded-xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                        <Input
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-3 rounded border border-yellow-500 bg-black text-yellow-400"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded border border-yellow-500 bg-black text-yellow-400"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 rounded border border-yellow-500 bg-black text-yellow-400"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-yellow-500 text-black p-3 rounded-lg hover:bg-yellow-600"
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
                <div className="flex flex-col justify-center items-center mt-2">
                    <p >Already have an account ?</p>
                    <Button className="border bg-yellow-400 border-yellow-400 text-black m-2 rounded-xl hover:text-yellow-400" onClick={() => router.push('/login')}> Login </Button>
                </div>
            </div>
        </div>
    );
}
