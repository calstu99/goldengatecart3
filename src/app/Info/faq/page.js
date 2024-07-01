"use client";
import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <div style={{
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '1rem',
      paddingBottom: '1rem'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textAlign: 'left',
          width: '100%',
          padding: '0.5rem 0'
        }}
      >
        {question}
        <span style={{ float: 'right' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p style={{
          marginTop: '0.5rem',
          lineHeight: '1.5'
        }}>
          {answer}
        </p>
      )}
    </div>
  );
};

const FAQPage = () => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping typically takes 3-5 business days for domestic orders and 7-14 days for international orders."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and times may vary depending on the destination."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email that you can use to monitor your package's progress."
    }
  ];

  return (

    <>

    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Frequently Asked Questions
      </h1>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>

    <div className="mx-24 mt-12 mb-8 text-center text-gray-600">
        <p>
          If you have any questions, please don't hesitate to reach out
          to us at <a href="mailto:support@trurosa.com" className="text-blue-600 hover:underline">support@trurosa.com</a> and we will get back to you
          during our office hours from Monday - Friday, 9 am – 6 pm ET.
        </p>
      </div>

    </>

    
  );
};

export default FAQPage;