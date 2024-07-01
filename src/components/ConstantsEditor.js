"use client";

import React, { useState } from 'react';
import { HeroText, landingPageText, HeroPagePics, SpecialPagePics, links, Hero_links, Hero_offers, link_headline, link_descriptions } from '@/app/utils/constants';

const ConstantsEditor = () => {
  const [constants, setConstants] = useState({
    HeroText,
    landingPageText,
    HeroPagePics,
    SpecialPagePics,
    links,
    Hero_links,
    Hero_offers,
    link_headline,
    link_descriptions
  });

  const handleChange = (section, key, value) => {
    setConstants(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-constants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(constants),
      });
      if (response.ok) {
        alert('Constants updated successfully!');
      } else {
        throw new Error('Failed to update constants');
      }
    } catch (error) {
      console.error('Error updating constants:', error);
      alert('Failed to update constants. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Site Content</h2>
      
      {Object.entries(constants).map(([section, values]) => (
        <div key={section} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">{section}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(values).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label htmlFor={`${section}-${key}`} className="block text-sm font-medium text-gray-700 mb-1">
                  {key}:
                </label>
                {typeof value === 'string' ? (
                  <input
                    type="text"
                    id={`${section}-${key}`}
                    value={value}
                    onChange={(e) => handleChange(section, key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <textarea
                    id={`${section}-${key}`}
                    value={JSON.stringify(value, null, 2)}
                    onChange={(e) => handleChange(section, key, JSON.parse(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Update Site Content
      </button>
    </form>
  );
};

export default ConstantsEditor;