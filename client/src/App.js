import "@fontsource/roboto";
import "./App.css";

// butter toast
import ButterToast, {POS_TOP, POS_CENTER} from 'butter-toast';

// redux store
import store from "./store";
import { Provider } from "react-redux";

// react-router-dom
import { BrowserRouter, Switch, Route } from "react-router-dom";

// components
import NavBar from "./components/NavBar/NavBar";
import Feed from "./components/Posts/Feed";
import AuthForm from "./components/Auth/AuthForm";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Feed} />
          <Route path="/auth" exact component={AuthForm} />
        </Switch>
        <ButterToast position={{vertical:POS_TOP, horizontal:POS_CENTER}} />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
