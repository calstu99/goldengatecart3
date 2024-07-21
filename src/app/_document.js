import { Html, Head, Main, NextScript } from "next/document";
import { FB_PIXEL_ID } from "../lib/fpixel";

export default function Document() {
  return (
    <Html>
      <Head>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

//the _document.js file is still useful for customizing the HTML document structure, including adding meta tags, external scripts, and other elements to the <head> or <body>.
//You can include a <noscript> tag for Facebook Pixel, which is important for tracking users who have JavaScript disabled, you can still use a custom _document.js file