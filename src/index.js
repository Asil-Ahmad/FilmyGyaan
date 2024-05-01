import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

import "./index.css";

//we gonna use Redux stuff from here
import { Provider } from "react-redux";
//as soon as you import provider we need to wrap all inside provider as
//seen below
import store from "./app/store";
//but in order to use the store data we need to fetch it from somewhere

import ToggleColorModeProvider from "./utils/ToggleColorMode";

// const theme = createTheme({
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 770,
//       md: 900,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// });

ReactDOM.render(
  <Provider store={store}>
    <ToggleColorModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToggleColorModeProvider>
  </Provider>,
  document.getElementById("root")
);
