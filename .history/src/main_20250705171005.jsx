import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
    <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode>
);
