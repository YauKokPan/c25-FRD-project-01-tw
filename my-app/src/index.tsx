import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./query/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "@progress/kendo-theme-default/dist/all.css";
import "./installApp"; // Import the installApp.ts file

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Container fluid className="home">
          <Provider store={store}>
            <App />
          </Provider>
        </Container>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
