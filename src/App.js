import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NewStory from "./pages/NewStory";
import StoryPage from "./pages/StoryPage";
import StoriesList from "./pages/StoriesList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route
                path="/new-story"
                element={
                  <PrivateRoute>
                    <NewStory />
                  </PrivateRoute>
                }
              />
              <Route
                path="/stories"
                element={
                  <PrivateRoute>
                    <StoriesList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/story/:storyId"
                element={
                  <PrivateRoute>
                    <StoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
