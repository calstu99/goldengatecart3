// metadata.js
export const metadata = {
    title: 'TruRosa Beauty | Premium Hair Care & Skincare Products',
    description: 'Discover TruRosa\'s range of natural, organic hair care and skincare products. Transform your beauty routine with our professional-grade, cruelty-free formulations.',
    keywords: 'hair products, beauty products, skincare, haircare, organic beauty, natural cosmetics',
    openGraph: {
      title: 'TruRosa Beauty | Premium Hair Care & Skincare Products',
      description: 'Transform your beauty routine with TruRosa\'s natural, organic hair and skincare products.',
      images: [
        {
          url: 'https://trurosa.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TruRosa Beauty product collection',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TruRosa Beauty | Premium Hair Care & Skincare Products',
      description: 'Transform your beauty routine with TruRosa\'s natural, organic hair and skincare products.',
      images: ['https://trurosa.com/twitter-image.jpg'],
      creator: '@trurosabeauty',
    },
  };

  //To add metadata to your landing page in Next.js 13, you'll need to export a metadata object or a generateMetadata function from your page component.