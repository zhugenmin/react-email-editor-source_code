import { Provider } from "react-redux";
import AppPage from "./pages/AppPage";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
import createStore from "./redux/reducers";

function App() {
  const history = createBrowserHistory();
  const initialState = {};
  const store = createStore(initialState);
  return (
    <Provider store={store}>
      <Router history={history}>
        <AppPage />
      </Router>
    </Provider>
  );
}

export default App;
