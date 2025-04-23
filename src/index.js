import React from "react";
import ReactDOM from "react-dom/client";
import ExpenseSplitter from "./ExpenseSplitter";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ExpenseSplitter />
  </React.StrictMode>
);
