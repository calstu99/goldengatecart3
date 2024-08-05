  // @/app/utils/SendSMS.js

  export const sendSMS = async (to, body) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiUrl}/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  };