import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "./CheckOutForm";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE!);


export default function CheckOutPage() {
  const [clientSecret, setClientSecret] = useState("");
  useEffect( () => {
    const url = `${process.env.REACT_APP_API_SERVER}/payments`;
    console.log(url);
    const data = {
      hotel: {
        id: 1,
        name: "Hotel California",
        price_per_hour: 100,
        total_hours: 2,
      },
      currency: "hkd",
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        setClientSecret(data.clientSecret);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret: clientSecret,
    appearance: appearance,
  };
  return (
    <>
      Client Sercret: {clientSecret}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckOutForm />{" "}
        </Elements>
      )}
    </>
  );
}
