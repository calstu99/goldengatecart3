"use client";
import React, { useState } from 'react';
import requireAuth from "@/app/utils/requireAuth";

const NotificationForm = () => {
  const [to, setTo] = useState('');
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');

  const isAuthorized = requireAuth(true); // Pass true for adminOnly

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    try {
      const response = await fetch("/api/email/notification", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, username, content }),
      });

      if (response.ok) {
        alert('Notification sent successfully');
        setTo('');
        setUsername('');
        setContent('');
      } else {
        alert('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification');
    }
  };

  if (!isAuthorized) {
    return null; // or render a loading state
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Notification</h2>
      <div className="mb-4">
        <label htmlFor="to" className="block text-gray-700 text-sm font-bold mb-2">
          Recipient Email:
        </label>
        <input
          type="email"
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Notification Content:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Type your message here. Press Enter for a new line."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send Notification
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;