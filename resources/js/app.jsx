import './i18n'; 
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import '../css/app.css';

createInertiaApp({
  resolve: (name) => {
    return import(/* @vite-ignore */ `./Pages/${name}`).then((module) => module.default);
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <Provider store={store}>
        <App {...props} />
      </Provider>
    );
  },
});
