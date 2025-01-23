import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AuthPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false); 
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Signed up successfully!");
            } else {
                
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Signed in successfully!");
            }
            navigate("/"); 
        } catch (error) {
            toast.error(error.message);
        }
    };


    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider(); 
            await signInWithPopup(auth, provider); 
            toast.success("Signed in with Google successfully!");
            navigate("/"); 
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white text-gray-900 font-sans flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">{isSignUp ? "Sign Up" : "Sign In"}</h1>
                <form onSubmit={handleSubmit}>
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
                        required
                    />
                    <motion.input
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
                        required
                    />
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 mb-4"
                    >
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </motion.button>
                </form>

                <div className="text-center my-4 text-gray-500 text-xl font-bold">or</div>

                {/* Google Sign-In Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 mb-4 flex items-center justify-center"
                >
                    <img
                        src="logo.png"
                        alt="Google Logo"
                        className="w-5 h-5 mr-2"
                    />
                    {isSignUp ? "Sign Up with Google" : "Sign In with Google"}
                </motion.button>

                {/* Toggle between Sign In and Sign Up */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-blue-500 hover:text-blue-600 text-center"
                >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default AuthPage;