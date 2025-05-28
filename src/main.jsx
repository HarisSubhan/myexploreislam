// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Provider } from "react-redux";
// import store from "./store/store";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
