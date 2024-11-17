import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Sign";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="879443798033-7gv50lj1dill9de019tte6ntvra7vhms.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
