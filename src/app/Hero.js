"use client";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { usePathname } from 'next/navigation';

import {HeroText,HeroPagePics,Hero_links, Hero_offers} from '@/app/utils/constants';

// const image1 = 'https://i.postimg.cc/ZYHw3HWJ/Windrunner-men1.png';
// const image2 = 'https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png';
// const image3 = 'https://i.postimg.cc/J7gg2KQM/Airforce-teen2.png';

const Hero = () => {
  const pathname = usePathname();
  return (
    <section className="mx-auto max-w-2xl px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      <div className="mb-8 flex flex-wrap justify-between md:mb-16">
        <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
          <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">
            {/* Top Fashion for a top price! */}
            {HeroText.MainText}
          </h1>
          <p className="max-w-md leading-relaxed text-hero-text-400 xl:text-lg">
            {/* We sell only the most exclusive and high quality products for you.
            We are the best so come and shop with us. */}
            {HeroText.MainDescription}
          </p>
        </div>

        <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
          <div className="relative left-12 top-12 z-30 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
            <Image
              src={HeroPagePics.Pic1}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              priority
              width={500}
              height={500}
            />
            
          </div>

          <div className="relative left-12 top-5 z-10 -ml-5 overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              src={HeroPagePics.Pic2}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              priority
              width={500}
              height={500}
            />
          </div>

          <div className="relative left-13 top-12 z-20 -ml-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg opacity-90">
            <Image
              src={HeroPagePics.Pic3}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              priority
              width={500}
              height={500}
            />
          </div>

          <div className="relative right-5 top-8 z-1 -ml-2 overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              // src="https://images.pexels.com/photos/8154672/pexels-photo-8154672.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=200&w=460"
              src={HeroPagePics.Pic4}
              alt="Great Photo"
              className="h-full w-full object-cover object-center"
              priority
              width={500}
              height={500}
            />
          </div>
        </div>

      </div>

      {/* <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex h-12 w-64 divide-x overflow-hidden rounded-lg border border-violet-300">
          {Hero_links.map((link, idx) => (
            <Link
              href={link.href}
              className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              {link.name}
            </Link>
          ))}

        </div>
      </div>         */}

      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
      <div className="flex h-12 w-64 divide-x overflow-hidden rounded-lg border border-violet-300">
          {Hero_links.map((link, idx) => (
            <Link
            key={idx} 
              href={link.href}
              className="flex w-1/3 items-center justify-center text-gray-500 transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
             <span className="text-xs font-semibold">{link.name}</span>
            </Link>
          ))}

        </div>


        {/* <Link
            // href="/specials"
            href="/specials?collectionHandles=march_specials"
            className="flex  w-1/2 items-center justify-center text-white transition duration-100 hover:bg-orange-500 active:bg-orange-600"
          >
            Sale!
          </Link> */}

        <div className="flex h-12 w-64 bg-hero-text-400 divide-x overflow-hidden rounded-lg border border-violet-300">
        {Hero_offers.map((link, idx) => (
            <Link
              key={idx} // Added key prop
              href={link.href}
              className="flex  w-1/2 items-center justify-center text-white transition duration-100 hover:bg-hero-text-100 active:bg-hero-text-300"
            >
              <span className="text-sm">{link.name}</span>
            </Link>
          ))}

        </div>
      </div>
  </section>
  )
}

export default Hero