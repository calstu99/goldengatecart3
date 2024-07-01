"use client";
import React, { useState } from 'react';

const PolicySection = ({ title, content }) => {
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
        {title}
        <span style={{ float: 'right' }}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{
          marginTop: '0.5rem',
          lineHeight: '1.5'
        }}>
          {content}
        </div>
      )}
    </div>
  );
};

const PrivacyPolicyPage = () => {
  const policySections = [
    {
      title: "Information We Collect",
      content: (
        <p>We collect personal information that you provide to us, such as your name, email address, and shipping address when you make a purchase. We also collect information about your browsing behavior on our website.</p>
      )
    },
    {
      title: "How We Use Your Information",
      content: (
        <p>We use your information to process orders, provide customer service, improve our website and services, and send you marketing communications (if you opt-in). We do not sell your personal information to third parties.</p>
      )
    },
    {
      title: "Credit Card Information and Third-Party Marketing",
      content: (
        <>
          <p>We want to assure our customers that we prioritize their privacy and financial security:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
            <li>We do not store any credit card information on our servers. All payment processing is handled by secure, third-party payment processors.</li>
            <li>We do not share your personal information with third-party marketing companies. Your data is used solely for the purpose of processing your orders and improving our services.</li>
          </ul>
        </>
      )
    },
    {
      title: "Cookies and Tracking Technologies",
      content: (
        <p>We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage your cookie preferences through your browser settings.</p>
      )
    },
    {
      title: "Data Security",
      content: (
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      )
    },
    {
      title: "Your Rights",
      content: (
        <p>You have the right to access, correct, or delete your personal information. You can also object to the processing of your data or request data portability. To exercise these rights, please contact us using the information provided below.</p>
      )
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
          Privacy Policy
        </h1>
        {policySections.map((section, index) => (
          <PolicySection key={index} title={section.title} content={section.content} />
        ))}
      </div>

      <div className="mx-24 mt-12 mb-8 text-center text-gray-600">
        <p>
          If you have any questions about our Privacy Policy, please don't hesitate to reach out
          to us at <a href="mailto:privacy@yourecommercesite.com" className="text-blue-600 hover:underline">privacy@yourecommercesite.com</a> and we will get back to you
          during our office hours from Monday - Friday, 9 am – 6 pm ET.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;