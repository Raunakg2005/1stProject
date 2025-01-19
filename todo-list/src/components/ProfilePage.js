import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiCheckCircle, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(auth.currentUser?.emailVerified || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setIsEmailVerified(auth.currentUser.emailVerified);
    }
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    setLoading(true);
    try {
      await updateEmail(auth.currentUser, email);
      toast.success("Email updated successfully!");
    } catch (error) {
      toast.error("Failed to update email: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error("Failed to send verification email: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center mb-6 hover:animate-bounce">
        <FiArrowLeft className="mr-2" /> Back to Main Page
      </Link>

      <h1 className="text-3xl font-semibold text-center mb-8">Profile Settings</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-3 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        />
        <button
          onClick={handleUpdateProfile}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          Update Profile
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        />
        <button
          onClick={handleUpdateEmail}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2 transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          Update Email
        </button>
        <div className="mt-2 flex items-center">
          {isEmailVerified ? (
            <>
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-green-500">Email verified</span>
            </>
          ) : (
            <>
              <FiAlertCircle className="text-yellow-500 mr-2" />
              <span className="text-yellow-500">Email not verified</span>
              <button
                onClick={handleSendEmailVerification}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg ml-2 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Verify Email
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-3 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          placeholder="Enter your old password"
        />
        <label className="block text-sm font-medium mb-2 mt-4">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          placeholder="Enter your new password"
        />
        <label className="block text-sm font-medium mb-2 mt-4">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          placeholder="Confirm your new password"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 transition duration-300 ease-in-out transform hover:scale-105"
          disabled={loading}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
