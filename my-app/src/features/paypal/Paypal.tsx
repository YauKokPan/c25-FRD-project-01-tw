import React from "react";
import { PayPalScriptProvider, PayPalButtons, ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

export default function Paypal() {
  const clientId = "AdYRozjxbFdDRCAJEbCGwemMlhG7egDUTsTiJuHD710JOtzgGK--PY0mn5vodLfnYNAo0nGa7UjwduiI";

  const options: ReactPayPalScriptOptions = {
    clientId: clientId
  };


  return (
    <div>
      <PayPalScriptProvider options={options}>
        <PayPalButtons 
        createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "13.99",
                    currency_code:"HKD"
                  },
                },
              ],
            });
          }}
          />
      </PayPalScriptProvider>
    </div>
  );
}