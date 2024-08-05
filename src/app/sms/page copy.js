"use client";
import { useState } from 'react';

export default function SMSForm() {
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  const sendSMS = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus('Message sent successfully!');
      setTo('');
      setBody('');
    } else {
      setStatus(`Failed to send message: ${data.error}`);
    }
  };

  return (
    <form onSubmit={sendSMS} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="to" className="block text-gray-700 text-sm font-bold mb-2">
          Recipient's Phone Number
        </label>
        <input
          id="to"
          type="tel"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="+1234567890"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">
          Message
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter your message here"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline h-32"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send SMS
        </button>
        {status && (
          <p className={`text-sm italic ${status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {status}
          </p>
        )}
      </div>
    </form>
  );
}