"use client";

import React from "react";

const TechRadar = () => {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Radar Background (Purple Pentagon) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M160 10L270 95L245 230H75L50 95L160 10Z"
            fill="#8B5CF6"
            fillOpacity="0.2"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
          <path
            d="M160 60L230 120L215 210H105L90 120L160 60Z"
            fill="#8B5CF6"
            fillOpacity="0.4"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
          <path
            d="M160 110L190 145L185 190H135L130 145L160 110Z"
            fill="#8B5CF6"
            fillOpacity="0.6"
            stroke="#8B5CF6"
            strokeWidth="2"
          />
          {/* Web-like lines connecting to dots */}
          <line x1="160" y1="160" x2="260" y2="60" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="290" y2="160" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="250" y2="260" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="160" y2="320" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="60" y2="260" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="30" y2="160" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="70" y2="60" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
          <line x1="160" y1="160" x2="160" y2="0" stroke="#8B5CF6" strokeOpacity="0.3" strokeWidth="1" />
        </svg>
      </div>

      {/* Technology Icons */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/cloud.svg" alt="Cloud" width="24" height="24" />
        </div>
      </div>

      <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/instagram.svg" alt="Social" width="24" height="24" />
        </div>
      </div>

      <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/infinity.svg" alt="Infinity" width="24" height="24" />
        </div>
      </div>

      <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/database.svg" alt="Database" width="24" height="24" />
        </div>
      </div>

      <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/doc.svg" alt="Document" width="24" height="24" />
        </div>
      </div>

      {/* Center Logo */}
      <div className="relative z-10 bg-white p-3 rounded-full shadow-md">
        <img src="/logo.svg" alt="Logo" width="32" height="32" />
      </div>

      {/* Additional Icons */}
      <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/code.svg" alt="Code" width="24" height="24" />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/file.svg" alt="File" width="24" height="24" />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-md shadow-md">
          <img src="/icons/chart.svg" alt="Chart" width="24" height="24" />
        </div>
      </div>
    </div>
  );
};

export default TechRadar;
