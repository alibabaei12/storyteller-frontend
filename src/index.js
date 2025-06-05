import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Suppress common Firebase network errors caused by ad blockers
window.addEventListener("unhandledrejection", (event) => {
  const message = event.reason?.message || "";
  const stack = event.reason?.stack || "";

  // Suppress Firebase ERR_BLOCKED_BY_CLIENT errors (caused by ad blockers)
  if (
    message.includes("ERR_BLOCKED_BY_CLIENT") ||
    stack.includes("firestore") ||
    stack.includes("googleapis.com")
  ) {
    console.warn(
      "Suppressed Firebase network error (likely caused by ad blocker):",
      message
    );
    event.preventDefault();
    return;
  }

  // Suppress "undefined" JSON parsing errors that have been fixed
  if (message.includes("undefined") && message.includes("JSON")) {
    console.warn("Suppressed JSON parsing error:", message);
    event.preventDefault();
    return;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
