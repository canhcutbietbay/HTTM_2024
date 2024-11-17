import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/Sign.css";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginSignup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `https://26.216.17.44:3000/api/${isSignUp ? "signUp" : "login"}`,
        {
          email: formData.email,
          password: formData.password,
          type: "default",
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/"); // Điều hướng sang trang chính
      } else {
        setError(
          response.data.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const response = await axios.post(
          `https://26.216.17.44:3000/api/login`,
          {
            email: userInfo.data.email,
            type: "google",
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const setCookieHeader = response.headers.get("Set-Cookie");
          console.log("Set-Cookie Header:", setCookieHeader);
          navigate("/"); // Điều hướng sang trang chính
        } else {
          setError(
            response.data.message ||
              "An error occurred while logging in with Google."
          );
        }
      } catch (error) {
        console.error("Error fetching Google user info:", error);
        setError("An error occurred while logging in with Google.");
      }
    },
    onError: () => {
      console.log("Login Failed");
      setError("An error occurred while logging in with Google.");
    },
  });

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="box">
          <h2>
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              className="mb-3"
              style={{ width: "60px", height: "60px" }}
            />
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="mx-0 w-100" onSubmit={handleSubmit}>
            <Form.Group className="mb-1" controlId="email">
              <Form.Label className="require">Account</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your account"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-1" controlId="password">
              <Form.Label className="require">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button className="mt-3 w-100" variant="primary" type="submit">
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </Form>

          <div className="mt-3">
            <Button
              onClick={() => handleGoogleLogin()}
              className="w-100 google-login"
            >
              <img
                className="image"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
              />
              Login with Google
            </Button>
          </div>

          <div className="mt-3">
            <Button variant="link" onClick={handleToggle}>
              {isSignUp
                ? "Already have an account? Login here"
                : "Don't have an account? Sign up here"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignup;
