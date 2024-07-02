import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

  const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;
  const website_url = process.env.NEXT_PUBLIC_BASE_API_URL;


// export const Email = () => {
//     return (
//       <Html>
//         <Button
//           href="https://example.com"
//           style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
//         >
//           Click me
//         </Button>
//       </Html>
//     );
//   };

  export const Email = ({
    userFirstname,
  }: EmailProps) => (
    <Html>
      <Head />
      <Preview>
        The sales intelligence platform that helps you uncover qualified leads.
      </Preview>
      <Body style={main}>
        <Container style={container}>
        <Img
                  src="https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png"
                  width="100"
                  height="120"
                  alt={websiteName}
                />
          <Text style={paragraph}>Hi {userFirstname},</Text>
          <Text style={paragraph}>
            Welcome to {websiteName}, the sales intelligence platform that helps you
            uncover qualified leads and close deals faster.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={website_url}>
              Get started
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            The {websiteName } team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  Email.PreviewProps = {
    userFirstname: "Alan",
  } as EmailProps;
  
  export default Email;
  
  const main = {
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
  };
  
  const logo = {
    margin: "0 auto",
  };
  
  const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
  };
  
  const btnContainer = {
    textAlign: "center" as const,
  };
  
  const button = {
    backgroundColor: "#5F51E8",
    borderRadius: "3px",
    color: "#fff",
    fontSize: "16px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px",
  };
  
  const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
  };
  
  const footer = {
    color: "#8898aa",
    fontSize: "12px",
  };