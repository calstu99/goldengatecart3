"use client";
import { useRouter } from 'next/navigation'


const page = () => {
const router = useRouter();

  const handleFilterProducts = () => {
    // const collectionHandles = ['men', 'women']; // Replace with your desired collection handles
    const collectionHandles = ['march_specials']; // Replace with your desired collection handles

    const queryParams = new URLSearchParams({ collectionHandles: collectionHandles.join(',') });
    router.push(`/specials?${queryParams.toString()}`);
  };
 
 
  return (
    <>
     <div><h1>SEARCH</h1></div>
    <button onClick={handleFilterProducts}>Filter Products</button>
    </>
   

  )
}

export default page