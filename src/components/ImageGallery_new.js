import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom'

export default function ImageGallery({ images }) {
  const [bigImage, setBigImage] = React.useState(images[0]);
  const currentIndex = useRef(0);

  const handleSmallImageClick = (image) => {
    setBigImage(image);
    currentIndex.current = images.indexOf(image);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      let nextIndex;
      if (event.key === 'ArrowUp') {
        nextIndex = currentIndex.current === 0 ? images.length - 1 : currentIndex.current - 1;
      } else {
        nextIndex = currentIndex.current === images.length - 1 ? 0 : currentIndex.current + 1;
      }
      setBigImage(images[nextIndex]);
      currentIndex.current = nextIndex;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="order-last flex gap-4 lg:order-none lg:flex-col">
        {images.map((image, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={image.node.src}
              width={600}
              height={600}
              alt="photo"
              className="h-full w-full object-cover object-center cursor-pointer md:w-[100px] md:h-[100px]"
              onClick={() => handleSmallImageClick(image)}
            />
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white-100 lg:col-span-4 ">
        <Zoom>
        <Image
          src={bigImage.node.src}
          alt="Photo"
          width={500}
          height={500}
          className="h-auto w-full object-contain" // Change object-cover to object-contain
        />
        </Zoom>

        <span className="absolute left-0 top-0 rounded-br-lg bg-red-500 px-3 py-1.5 text-sm md:text-xs uppercase tracking-wider text-white">
          Sale
        </span>
      </div>
    </div>
  );
}

// https://github.com/ski043/nextjs-commerce-tutorial/blob/main/app/components/ImageGallery.tsx