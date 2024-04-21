"use client";
import React, { useState } from 'react';

const Gallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(images).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => handleImageClick(image)}
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
          />
        ))}
      </div>

      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <span
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <img src={selectedImage} alt="Selected" className="max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
