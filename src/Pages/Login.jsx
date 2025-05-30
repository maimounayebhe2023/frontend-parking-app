import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/Login.css";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(phoneNumber, password);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useAuth
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="login-box p-4">
            <div className="text-center mb-4">
              <img
                src="/parking-icon.svg"
                alt="Logo"
                className="login-logo mb-3"
              />
              <h2 className="text-primary">Connexion</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Numéro de téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Entrez votre numéro de téléphone"
                  required
                  pattern="[0-9]{9}"
                  title="Veuillez entrer un numéro de téléphone valide (9 chiffres)"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  minLength={6}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
