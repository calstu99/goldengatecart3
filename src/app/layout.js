import { Inter} from 'next/font/google'
import "./globals.css";
import "@/app/custom.css";
import Nav from '@/components/Nav';
import Footer from "@/components/Footer";
// import CartModal from "../components/CartModal";
import CartModal from "@/components/CartModal";
import { CartProvider } from "../components/CartContext";
import { Toaster } from "react-hot-toast";
import CartSummary from '@/components/CartSummary';
import SessionProvider from "@/app/utils/SessionProvider";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Golden Gate Cart",
  description: "Powering Top Fashion for a top price",
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
        {children}
        <Footer/>
        <CartSummary /> {/* Add this line */}
        </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
