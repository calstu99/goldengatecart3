'use client';

import React, { useState } from 'react';
import ProductVariant from '@/components/SingleProductVariant';
import { useRouter } from 'next/navigation';

const ClientProductDetails = () => {
  const router = useRouter();
  const product = router.state?.product;
  const [showVariants, setShowVariants] = useState(product !== null);

  console.log('product', product);

  return (
    <div>
      {showVariants && (
        <ProductVariant
          selectedProduct={product}
          onCloseVariants={() => setShowVariants(false)}
        />
      )}
    </div>
  );
};

export default ClientProductDetails;