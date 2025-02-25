import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../config";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
    
        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }
    
            const data = await response.json();
            localStorage.setItem("token", data.token); 

            const decodedToken = jwtDecode(data.token);
            localStorage.setItem("userRole", decodedToken.role[0]);

            navigate("/home"); 
    
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div  
        style={{ 
            backgroundImage: "url('/background.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            margin: 0,
            padding: 0
        }}
        >
        <div className="mb-80">
            <span>Debes iniciar sesión para acceder a la plataforma</span>
        </div>

        <Modal show={true}  centered>
            <Modal.Header>
                <span className="text-wrap text-center">
                    Digita tu documento de identidad del propietario o representante legal y la contraseña
                </span>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-4">
                        <FloatingLabel controlId="email" label="Correo electronico" className="mb-3">   
                            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <FloatingLabel controlId="password" label="Constrseña" className="mb-3"> 
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Acepto términos y condiciones" required />
                    </Form.Group>

                    <Button variant="danger" type="submit" className="w-100">
                        Iniciar Sesión
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </div>
    );
};

export default Login;
