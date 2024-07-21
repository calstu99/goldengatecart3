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

  export const WelcomeEmail = ({
    userFirstname,
  }: EmailProps) => (
    <Html>
      <Head />
      <Preview>
       The Best in high quality beauty and hair products!
      </Preview>
      <Body style={main}>
        <Container style={container}>
        <Img
                  src="https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png"
                  width="100"
                  height="120"
                  alt={websiteName}
                />
          <Text style={paragraph}>Welcome to  {websiteName}!</Text>
          <Text style={paragraph}>
            Thank you for signing up for {websiteName}. We're thrilled to have you on board! Here at {websiteName}, we strive to provide
            the best service to help you find the best quality beauty and hair products.
          </Text>
          {/* <Text style={paragraph}>
            If you have any questions, feel free to reply to this email or reach out to our support team at <a href={`mailto:${process.env.EMAIL_ADDRESS}`}>{process.env.EMAIL_ADDRESS}</a>
          </Text> */}

           {/* <Text style={paragraph}>
            If you have any questions, feel free to reply to this email or reach out to our support team at {`${website_url}/Info/faq`}.
          </Text> */}
          
          <Section style={btnContainer}>
            <Button style={button} href={website_url}>
              Login and get started
            </Button>
          </Section>
          <Text style={paragraph}>
            Best regards,
            <br />
            The {websiteName } team
          </Text>
          <Hr style={hr} />
          
        </Container>
      </Body>
    </Html>
  );
  
  WelcomeEmail.PreviewProps = {
    userFirstname: "Alan",
  } as EmailProps;
  
  export default WelcomeEmail;
  
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