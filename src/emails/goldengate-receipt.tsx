import {
    Body,
    Container,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  import logo from '../../public/images/logo.png';

  // interface AppleReceiptEmailProps {
  //   total: number | string;
  // }

  interface AppleReceiptEmailProps {
    total: number;
    name: string;
    email: string;
    items: Array<{
      name: string;
      quantity: number;
      unit_price: number;
      amount_total: number;
    }>;
    shipping_address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    currency: string;
    status: string;
    orderDate: string;
    orderTime: string;
    paymentMethod: string;
    transaction_id:string,
  }
  
  // const baseUrl = process.env.VERCEL_URL
  //   ? `https://${process.env.VERCEL_URL}`
  //   : "";
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME;
  export const AppleReceiptEmail = ({total,
    name,
    email,
    items,
    shipping_address,
    currency,
    status,
    orderDate,
    orderTime,
    paymentMethod,transaction_id}
    :AppleReceiptEmailProps) => (
    <Html>
      <Head />
      <Preview>{`Hello from ${websiteName} We're processing your order. Thank our for shipping with us. We'll 
      send confirmation when your item ships.`}</Preview>
  
      <Body style={main}>
        <Container style={container}>
          <Section key= "header">
            <Row>
              <Column>
              <Img
                  src="https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png"
                  width="70"
                  height="84"
                  alt={websiteName}
                />
              </Column>
  
              <Column align="right" style={tableCell}>
                <Text style={heading}>Receipt</Text>
              </Column>
            </Row>
            <br/>
          </Section>
          <Section key = "promo">
            <Text style={headerValue}>
              Thank you for shopping with us. We'll send a confirmation when your item ships.
            </Text>
            <Text style={cupomText}>
              Save 3% on all your purchases by becoming a member.
              <sup style={supStyle}>1</sup>{" "}
              <Link href={`${apiBaseUrl}/register`}>
                Join and receive discounts in minutes
              </Link>

              <sup style={supStyle}>2</sup>
            </Text>
          </Section>
          <Section key = "info" style={informationTable}>
            <Row style={informationTableRow}>
              <Column colSpan={2}>
                <Section>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>EMAIL</Text>
                      <Link
                        style={{
                          ...informationTableValue,
                          color: "#15c",
                          textDecoration: "underline",
                        }}
                      >
                       {email}
                      </Link>
                    </Column>
                  </Row>
  
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>INVOICE DATE</Text>
                      <Text style={informationTableValue}>{orderDate}</Text>
                   
                    </Column>
                  </Row>
                  <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>ORDER NO.</Text>
                      <Text style={informationTableValue}>{transaction_id}</Text>
                   
                    </Column>
                  </Row>
  
                  {/* <Row>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>ORDER ID</Text>
                      <Link
                        style={{
                          ...informationTableValue,
                          color: "#15c",
                          textDecoration: "underline",
                        }}
                      >
                        ML4F5L8522
                      </Link>
                    </Column>
                    <Column style={informationTableColumn}>
                      <Text style={informationTableLabel}>INVOICE NO.</Text>
                      <Text style={informationTableValue}>{transaction_id}</Text>
                    </Column>
                  </Row> */}
                </Section>
              </Column>
              <Column style={informationTableColumn} colSpan={2}>
                <Text style={informationTableLabel}>SHIPPING TO</Text>
                {/* <Text style={informationTableValue}>
                  Name of purchaser{name}
                </Text> */}
                <Text style={informationTableValue}>{name}</Text>
                <Text style={informationTableValue}>{shipping_address.line1}</Text>
                <Text style={informationTableValue}>{shipping_address.city}, {shipping_address.postal_code}</Text>
                <Text style={informationTableValue}>{shipping_address.country}</Text>  
              </Column>
            </Row>

            <Row>
              <Column style={informationTableColumn}>
                <Text style={informationTableLabel}>PAYMENT METHOD:</Text>
                <Text style={informationTableValue}>PAYPAL</Text>

              </Column>
            </Row>
            
          </Section>
          <Section key = "website" style={productTitleTable}>
            <Text style={productsTitle}>Products Purchased</Text>
          </Section>
          <Section key = "items">
          
          {items.map((item, index) => (

            <> 
            <Row key ={index}>
              <Column style={{ width: "64px" }}>
                {/* <Img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/default-product-image.png`}
                  width="64"
                  height="64"
                  alt={item.name}
                  style={productIcon}
                /> */}
              </Column>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>{item.name}</Text>
                <Text style={productDescription}>Quantity: {item.quantity}</Text>
                <Text style={productDescription}>Unit Price: {currency} ${item.unit_price.toFixed(2)}</Text>
              </Column>
              <Column style={productPriceWrapper} align="right">
                <Text style={productPrice}>{currency} ${item.amount_total.toFixed(2)}</Text>
              </Column>
            </Row>
            
            <br/>
            </>
            
          ))}
        </Section>
          <Hr style={productPriceLine} />
          <Section key = "total" align="right">
            <Row>
              <Column style={tableCell} align="right">
                <Text style={productPriceTotal}> Order Total</Text>
              </Column>
              <Column style={productPriceVerticalLine}></Column>
              <Column style={productPriceLargeWrapper}>
                <Text style={productPriceLarge}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={productPriceLineBottom} />
          <Section key = "logo">
            <Row>
              <Column align="center" style={block}>
              <Img
                  src="https://i.postimg.cc/GhNJJ5dn/phoenix-women1.png"
                  width="60"
                  height="72"
                  alt={websiteName}
                />
              </Column>
            </Row>
          </Section>
          <Section key = "cta">
            <Row>
              <Column align="center" style={ctaTitle}>
                <Text style={ctaText}>Save 3% on all your purchases.</Text>
              </Column>
            </Row>
          </Section>
          
        </Container>
      </Body>
    </Html>
  );
  
  export default AppleReceiptEmail;
  
  const main = {
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    backgroundColor: "#ffffff",
  };
  
  const resetText = {
    margin: "0",
    padding: "0",
    lineHeight: 1.4,
  };
  
  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "660px",
    maxWidth: "100%",
  };
  
  const headerValue = {
    fontSize: "12px",
    margin: "0",
    padding: "0",
    lineHeight: 1.4,
  };
  const tableCell = { display: "table-cell" };
  
  const heading = {
    fontSize: "32px",
    fontWeight: "300",
    color: "#888888",
  };
  
  const cupomText = {
    textAlign: "center" ,
    margin: "36px 0 40px 0",
    fontSize: "14px",
    fontWeight: "500",
    color: "#111111",
  };
  
  const supStyle = {
    fontWeight: "300",
  };
  
  const informationTable = {
    borderCollapse: "collapse" ,
    borderSpacing: "0px",
    color: "rgb(51,51,51)",
    backgroundColor: "rgb(250,250,250)",
    borderRadius: "3px",
    fontSize: "12px",
  };
  
  const informationTableRow = {
    height: "46px",
  };
  
  const informationTableColumn = {
    paddingLeft: "20px",
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: "0px 1px 1px 0px",
    height: "44px",
  };
  
  const informationTableLabel = {
    ...resetText,
    color: "rgb(102,102,102)",
    fontSize: "10px",
  };
  
  const informationTableValue = {
    fontSize: "12px",
    margin: "0",
    padding: "0",
    lineHeight: 1.4,
  };
  
  const productTitleTable = {
    ...informationTable,
    margin: "30px 0 15px 0",
    height: "24px",
  };
  
  const productsTitle = {
    background: "#fafafa",
    paddingLeft: "10px",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0",
  };
  
  const productIcon = {
    margin: "0 0 0 20px",
    borderRadius: "14px",
    border: "1px solid rgba(128,128,128,0.2)",
  };
  
  const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };
  
  const productDescription = {
    fontSize: "12px",
    color: "rgb(102,102,102)",
    ...resetText,
  };
  
  const productLink = {
    fontSize: "12px",
    color: "rgb(0,112,201)",
    textDecoration: "none",
  };
  
  const divisor = {
    marginLeft: "4px",
    marginRight: "4px",
    color: "rgb(51,51,51)",
    fontWeight: 200,
  };
  
  const productPriceTotal = {
    margin: "0",
    color: "rgb(102,102,102)",
    fontSize: "10px",
    fontWeight: "600",
    padding: "0px 30px 0px 0px",
    textAlign: "right" ,
  };
  
  const productPrice = {
    fontSize: "12px",
    fontWeight: "600",
    margin: "0",
  };
  
  const productPriceLarge = {
    margin: "0px 20px 0px 0px",
    fontSize: "16px",
    fontWeight: "600",
    whiteSpace: "nowrap" ,
    textAlign: "right" ,
  };
  
  const productPriceWrapper = {
    display: "table-cell",
    padding: "0px 20px 0px 0px",
    width: "100px",
    verticalAlign: "top",
  };
  
  const productPriceLine = { margin: "30px 0 0 0" };
  
  const productPriceVerticalLine = {
    height: "48px",
    borderLeft: "1px solid",
    borderColor: "rgb(238,238,238)",
  };
  
  const productPriceLargeWrapper = { display: "table-cell", width: "90px" };
  
  const productPriceLineBottom = { margin: "0 0 75px 0" };
  
  const block = { display: "block" };
  
  const ctaTitle = {
    display: "block",
    margin: "15px 0 0 0",
  };
  
  const ctaText = { fontSize: "24px", fontWeight: "500" };
  
  const walletWrapper = { display: "table-cell", margin: "10px 0 0 0" };
  
  const walletLink = { color: "rgb(0,126,255)", textDecoration: "none" };
  
  const walletImage = {
    display: "inherit",
    paddingRight: "8px",
    verticalAlign: "middle",
  };
  
  const walletBottomLine = { margin: "65px 0 20px 0" };
  
  const footerText = {
    fontSize: "12px",
    color: "rgb(102,102,102)",
    margin: "0",
    lineHeight: "auto",
    marginBottom: "16px",
  };
  
  const footerTextCenter = {
    fontSize: "12px",
    color: "rgb(102,102,102)",
    margin: "20px 0",
    lineHeight: "auto",
    textAlign: "center" 
  };
  
  const footerLink = { color: "rgb(0,115,255)" };
  
  const footerIcon = { display: "block", margin: "40px 0 0 0" };
  
  const footerLinksWrapper = {
    margin: "8px 0 0 0",
    textAlign: "center" ,
    fontSize: "12px",
    color: "rgb(102,102,102)",
  };
  
  const footerCopyright = {
    margin: "25px 0 0 0",
    textAlign: "center",
    fontSize: "12px",
    color: "rgb(102,102,102)",
  };
  
  const walletLinkText = {
    fontSize: "14px",
    fontWeight: "400",
    textDecoration: "none",
  };
  