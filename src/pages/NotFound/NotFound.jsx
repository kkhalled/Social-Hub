import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCompass,
  faArrowLeft,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen py-5 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-5 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <FontAwesomeIcon
            icon={faShareNodes}
            className="text-3xl text-blue-600 group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="text-2xl font-bold text-gray-900">SocialHub</span>
        </Link>

        {/* 404 Number with gradient */}
        <div className="relative mb-6">
          <h1 className="text-[180px] sm:text-[220px] font-black leading-none bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent select-none">
            404
          </h1>
          {/* Floating elements around 404 */}
          <div className="absolute top-8 left-1/4 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-16 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100 opacity-60"></div>
          <div className="absolute bottom-12 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200 opacity-60"></div>
        </div>

        {/* Message */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Oops! Page not found
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            to="/"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <FontAwesomeIcon
              icon={faHouse}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span>Go to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg">
          <p className="text-sm text-gray-500 mb-4 font-medium">
            Or explore these popular pages:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl text-sm font-medium transition-all duration-300 group"
            >
              <FontAwesomeIcon
                icon={faHouse}
                className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
              />
              Home
            </Link>
            <Link
              to="/explore"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl text-sm font-medium transition-all duration-300 group"
            >
              <FontAwesomeIcon
                icon={faCompass}
                className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
              />
              Explore
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl text-sm font-medium transition-all duration-300 group"
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></span>
              Profile
            </Link>
          </div>
        </div>

        {/* Fun illustration alternative - disconnected plug icon */}
        <div className="mt-12 flex items-center justify-center gap-3 text-gray-300">
          <div className="flex items-center">
            <div className="w-8 h-3 bg-gray-200 rounded-l-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full ml-1"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full ml-0.5"></div>
          </div>
          <div className="w-8 border-t-2 border-dashed border-gray-200"></div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-0.5"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-8 h-3 bg-gray-200 rounded-r-full"></div>
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-2">Connection lost...</p>
      </div>
    </div>
  );
}
