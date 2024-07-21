"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import * as pixel from "../lib/fpixel";

const FacebookPixel = () => {
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!loaded) return;

    pixel.pageview();
  }, [pathname, loaded]);

  return (
    // <div>
    //   <Script
    //     id="fb-pixel"
    //     src="/scripts/pixel.js"
    //     strategy="afterInteractive"
    //     onLoad={() => setLoaded(true)}
    //     data-pixel-id={pixel.FB_PIXEL_ID}
    //   />
    // </div>

    <div>
        <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
            __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixel.FB_PIXEL_ID}');
                fbq('track', 'PageView');
            `,
            }}
            onLoad={() => setLoaded(true)}
        />
    </div>
  );
};

export default FacebookPixel;