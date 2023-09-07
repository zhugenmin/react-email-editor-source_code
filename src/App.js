import AppPage from "./pages/AppPage";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

function App() {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <AppPage />
    </Router>
  );
}

export default App;
