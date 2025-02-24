//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Crear from './components/Datos_generales';
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar Bootstrap

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crear" element={<Crear />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
