import { Inter} from 'next/font/google'
import "./globals.css";
import "@/app/custom.css";
import Nav from '@/components/Nav';
import Footer from "@/components/Footer";
import CartModal from "@/components/CartModal";
import { CartProvider } from "../components/CartContext";
import { Toaster } from "react-hot-toast";
import CartSummary from '@/components/CartSummary';
import SessionProvider from "@/app/utils/SessionProvider";
import { getServerSession } from "next-auth";
import FacebookPixel from "@/components/FacebookPixel";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  // title: "Golden Gate Cart",
  // description: "Powering Top Fashion for a top price",
  title: process.env.NEXT_PUBLIC_WEBSITE_NAME || "Golden Gate Cart",
  description: process.env.NEXT_PUBLIC_WEBSITE_DESCRIPTION || "Discover exclusive high-quality beauty and hair products at Trurosa ",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      
      <body className={inter.className}>
      <SessionProvider session={session}>
        <CartProvider>
        <Nav />
        <CartModal/>
        <Toaster/>
        <FacebookPixel/>
        {children}
        <Footer/>
        {/* <CartSummary />  */}
        </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
