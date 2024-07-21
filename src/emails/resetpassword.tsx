import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  
  interface ResetPasswordEmailProps {
    userFirstname?: string;
    resetPasswordLink?: string;
  }
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;
  export const ResetPasswordEmail = ({
    userFirstname,
    resetPasswordLink,
  }: ResetPasswordEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Dropbox reset your password</Preview>
        <Body style={main}>
          <Container style={container}>
          <Img
                  src="https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png"
                  width="70"
                  height="84"
                  alt={websiteName}
                />
            <Section>
              <Text style={text}>Email: {userFirstname},</Text>
              <Text style={text}>
                Someone recently requested a password change for your
                account. If this was you, you can set a new password here:
              </Text>
              <Button style={button} href={resetPasswordLink}>
                Reset password
              </Button>
              <Text style={text}>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text style={text}>
                Reset Password{" "}
                <Link style={anchor} href={resetPasswordLink}>
                 
                </Link>
              </Text>
              <Text style={text}>Happy Shopping!</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  ResetPasswordEmail.PreviewProps = {
    userFirstname: "Alan",
    resetPasswordLink: "https://dropbox.com",
  } as ResetPasswordEmailProps;
  
  export default ResetPasswordEmail;
  
  const main = {
    backgroundColor: "#f6f9fc",
    padding: "10px 0",
  };
  
  const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #f0f0f0",
    padding: "45px",
  };
  
  const text = {
    fontSize: "16px",
    fontFamily:
      "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: "300",
    color: "#404040",
    lineHeight: "26px",
  };
  
  const button = {
    backgroundColor: "#007ee6",
    borderRadius: "4px",
    color: "#fff",
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "210px",
    padding: "14px 7px",
  };
  
  const anchor = {
    textDecoration: "underline",
  };
  