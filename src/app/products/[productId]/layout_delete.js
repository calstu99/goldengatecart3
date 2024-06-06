'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ClientProductDetails from './ClientProductDetails';

// export default function Layout({ children }) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const productId = searchParams.get('productId');

//   return (
//     <div>
//       {console.log('searchParams', searchParams.get('productId'))}
//       {children}
//       {/* <ClientProductDetails /> */}
//       {pathname === `/products/[productId]` && productId && (
//          <ClientProductDetails />
//           /* Additional content or components */
   
//       )}
//     </div>
//   );
// }



export default function Layout({ children }) {
  const router = useRouter();
  const product = router.state?.product;

  console.log('product',product);

  return (
    <div>
      {children}
      {console.log(product)}
      {/* <ClientProductDetails /> */}
      {product && <ClientProductDetails product={product} />}
    </div>
  );
}