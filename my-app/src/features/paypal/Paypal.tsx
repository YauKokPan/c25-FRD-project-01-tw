import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import Swal from "sweetalert2";

export default function Paypal() {
  // const clientId =
  //   "AdYRozjxbFdDRCAJEbCGwemMlhG7egDUTsTiJuHD710JOtzgGK--PY0mn5vodLfnYNAo0nGa7UjwduiI";

  const options: ReactPayPalScriptOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
    // clientId: clientId,
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
                    value: "0.01",
                  },
                },
              ],
            });
          }}
          onApprove={async function (data, actions) {
            if (actions.order) {
              await actions.order.capture();
              Swal.fire({
                title: "付款成功！",
                text: "謝謝使用本平台預訂🤗",
                timer: 2000,
              });
            }
            return Promise.resolve();
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
