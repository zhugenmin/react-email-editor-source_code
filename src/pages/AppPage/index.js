import { Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../Dashboard";
export default function AppPage() {
  const location = useLocation();
  return (
    <Switch location={location} key={location.pathname}>
      <Route exact path="/" component={Dashboard} />
    </Switch>
  );
}
