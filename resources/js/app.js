import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import '../css/app.css'; // This assumes you're in resources/js

createInertiaApp({
  resolve: (name) => import(`./pages/${name}`).then((module) => module.default),
  setup({ el, App, props }) {
    createRoot(el).render(
      <Provider store={store}>
        <App {...props} />
      </Provider>
    );
  },
});
