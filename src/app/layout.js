import { Inter } from "next/font/google";
import "./globals.css";
import "../app/custom.css";
import Nav from '../components/Nav';
import Footer from "../components/Footer";
import CartModal from "../components/CartModal";
import { CartProvider } from "../components/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Golden Gate Cart",
  description: "Powering Top Fashion for a top price",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
        <Nav />
        <CartModal/>
       
        {children}
        <Footer/>
        </CartProvider>
      </body>
    </html>
  );
}
