import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "@/index.css";
import App from "@/App.tsx";
import store from "@/store/index.ts";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        autoClose={2000}
        limit={5}
      />
      <App />
    </Provider>
  </BrowserRouter>
);
