import { Suspense } from "react";
import "antd/dist/antd.css";
import { render } from "react-dom";
import { Provider } from "react-redux";

import CircleLoader from "shared/components/circleLoader";
import "./index.scss";
import "./i18n";
import store from "store/configureStore";
import App from "./app";

render(
  <Provider store={store}>
    <Suspense fallback={<CircleLoader />}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root"),
);
