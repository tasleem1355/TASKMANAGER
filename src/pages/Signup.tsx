import React from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Signup(): JSX.Element {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Signup
        </h1>

        {/* Your Signup Form */}

        <form className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}

        <div className="my-6 flex items-center">

          <div className="flex-1 border-t"></div>

          <span className="px-3 text-gray-400">
            OR
          </span>

          <div className="flex-1 border-t"></div>

        </div>

        {/* Google Login Button */}

        <GoogleLoginButton />

      </div>

    </div>
  );
}