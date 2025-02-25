import axios from "axios";
import { Modal, Form, FloatingLabel, Table, Button, Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { FaEdit } from "react-icons/fa";
import { BsFillTrash3Fill, BsCheckSquareFill, BsXCircleFill, BsDownload } from "react-icons/bs";


const Home = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [selectedId, setSelectedId] = useState(null);
    const [userRole, setUserRole] = useState("");

    const [documento, setDocumento] = useState("");
    const [razonSocial, setRazonSocial] = useState("");
    const [email, setEmail] = useState("");
    const [fechaRegistro, setFechaRegistro] = useState("");
    const [telefono, setTelefono] = useState("");
    const [municipios, setMunicipios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);
    const [municipio, setMunicipioSeleccionado] = useState("");
    const [estado, setEstado] = useState("");
    
    useEffect(() => {
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        setUserRole(localStorage.getItem("userRole"));
        
        
        if (!token) {
            navigate("/");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/v1/home", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);

            const municipiosResponse = await axios.get("http://localhost:8080/api/v1/getMunicipio", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMunicipios(municipiosResponse.data);
            setDepartamentos([...new Set(municipiosResponse.data.map(m => m.departamento))]);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };

    useEffect(() => {
        if (departamentoSeleccionado) {
            setMunicipiosFiltrados(municipios.filter(m => m.departamento === departamentoSeleccionado));
        } else {
            setMunicipiosFiltrados([]);
        }
    }, [departamentoSeleccionado, municipios]);

    const crearComerciante = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const endpoint = selectedId ? `http://localhost:8080/api/v1/updateComerciante/${selectedId}` : "http://localhost:8080/api/v1/createComerciante";
        const method = selectedId ? "put" : "post";

        try {
            await axios[method](endpoint, {
                documento,
                razonSocial,
                municipio,
                telefono,
                email,
                fechaRegistro,
            }, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            setToastMessage(selectedId ? "Registro actualizado correctamente." : "Se guardó el registro correctamente.");
            setToastVariant("success");
            setShowToast(true);
            setShow(false);
            fetchData();
            setSelectedId(null);
        } catch (error) {
            setToastMessage("Error al guardar el registro. Revisar el log.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };

    const editar = (empresa) => {
        setSelectedId(empresa.id);
        setDocumento(empresa.documento);
        setRazonSocial(empresa.razonSocial);
        setEmail(empresa.email);
        setFechaRegistro(empresa.fechaRegistro);
        setTelefono(empresa.telefono);
        setShow(true);
    };

    const eliminarComerciante = async (id) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("¿Está seguro de que desea eliminar este comerciante?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/v1/deleteComerciante/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setToastMessage("Comerciante eliminado correctamente.");
            setToastVariant("success");
            setShowToast(true);
            fetchData(); // Recargar la lista
        } catch (error) {
            setToastMessage("Error al eliminar el comerciante.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };


    const activeOrInactive = async (id, p_estado) => {
        const token = localStorage.getItem("token");
        const nuevoEstado = p_estado === true ? false : true;
        
        try {
            const response = await fetch("http://localhost:8080/api/v1/activeOrInactive/"+id, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ estado : nuevoEstado }),
            });
            setToastMessage("Se actualizo el registro.");
            setToastVariant("success");
            setShowToast(true);
            fetchData();
        } catch (error) {
            setToastMessage("Error al actualizar el registro.");
            setToastVariant("danger");
            setShowToast(true);
        }
    };


    return (
    <>

        <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1 }}>
            <Toast bg={toastVariant} show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{toastVariant === "success" ? "Éxito" : "Error"}</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>

        {}
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
            <Container>
                <Navbar.Brand href="#home">OL Software</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Lista Formulario</Nav.Link>
                        <Nav.Link href="#link">Crear Formulario</Nav.Link>
                        <Nav.Link href="#link">Beneficios por mejorar</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Container >
            <h2 className="justify-content-start">Listado Formularios Creados</h2>
        </Container>

        <Container className="d-flex gap-2 justify-content-end">
            <Button variant="danger" onClick={() => setShow(true)}>Crear Formulario nuevo</Button>
            <Button variant="outline-danger">Descargar Reporte en CSV</Button>
        </Container>

        {}
        <Container className="mt-2">
            
            <Table striped bordered hover responsive>
                <thead className="table-primary">
                <tr>
                    <th hidden>id</th>
                    <th hidden>docuento</th>
                    <th>Razón Social</th>
                    <th>Teléfono</th>
                    <th>Correo Electrónico</th>
                    <th>Fecha Registro</th>
                    <th>Nro Establecimientos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {data.map((empresa) => (
                    <tr key={empresa.id}>
                    <td hidden>{empresa.id}</td>
                    <td hidden>{empresa.documento}</td>
                    <td>{empresa.razonSocial}</td>
                    <td>{empresa.telefono}</td>
                    <td>{empresa.email}</td>
                    <td>{empresa.fechaRegistro}</td>
                    <td>{empresa.cantidadEstablecimientos}</td>
                    <td>
                        <Button variant={empresa.estado ? 'outline-success' : 'outline-danger'} disabled>
                            {empresa.estado ? 'Activo' : 'Inactivo'}
                        </Button>
                    </td>
                    <td>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => editar(empresa)}>
                            <FaEdit />
                        </Button>
                        {userRole === "ADMIN" && (
                            <Button variant="warning" size="sm" className="me-2" onClick={() => eliminarComerciante(empresa.id)}>
                                <BsFillTrash3Fill />
                            </Button>
                        )}
                        <Button
                            variant={empresa.estado === true ? "danger" : "success" }
                            size="sm"
                            className="me-2"
                            onClick={() => activeOrInactive(empresa.id, empresa.estado)}
                        >
                            {empresa.estado === true ? <BsXCircleFill /> : <BsCheckSquareFill />}
                        </Button>
                        <Button variant="info" size="sm"><BsDownload /></Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>


        <Modal show={show} size="lg" centered onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <span className="text-wrap text-start">Datos Generales</span>
            </Modal.Header>
            
            <Modal.Body>
                
                <Form onSubmit={crearComerciante}>
                    <Container className="d-flex gap-2">

                    <Form.Group className="mb-4" >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Documento"
                                className="mb-3">   
                                <Form.Control type="number" value={documento} onChange={(e) => setDocumento(e.target.value)} required/>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-4" >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Razon social"
                                className="mb-3"
                            >   
                                <Form.Control type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} required />
                            </FloatingLabel>
                        </Form.Group>
                        <Form.Group className="mb-4" >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Correo electronico"
                                className="mb-3"
                            >   
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Container>

                    <Container className="d-flex gap-2">

                        <Form.Group className="mb-4">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Departamentos"
                                className="mb-3">   
                                <Form.Select 
                                    aria-label="Selecciona un departamento" 
                                    value={departamentoSeleccionado} 
                                    onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                                >
                                    <option value="">Selecciona un departamento</option>
                                    {departamentos.map((departamento, index) => (
                                        <option key={index} value={departamento}>
                                            {departamento}
                                        </option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                        

                        <Form.Group className="mb-4">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Municipios"
                                className="mb-3">   
                                <Form.Select 
                                    aria-label="Selecciona una ciudad" 
                                    value={municipio} 
                                    onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                                    disabled={!departamentoSeleccionado}
                                >
                                    <option value="">Selecciona un municipio</option>
                                    {municipiosFiltrados.map((municipio, index) => (
                                        <option key={index} value={municipio.nombre}>
                                            {municipio.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-4" >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Fecha ingreso"
                                className="mb-3"
                            >   
                                <Form.Control type="date" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-4" >
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Telefóno"
                                className="mb-3"
                            >   
                                <Form.Control type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>

                    </Container>

                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Posee establecimientos?" required />
                    </Form.Group>

                    <Button variant="danger" type="submit" className="w-100">
                        {selectedId ? "Actualizar" : "Enviar Formulario"}
                    </Button>
                    
                </Form>
            </Modal.Body>
        </Modal>
    </>
    );
};

export default Home;
