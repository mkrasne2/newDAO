import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.js';
import Table from './components/Table.js';
import Aboutus from './components/About.js';
import Form from './components/Form.js';
import Submitvote from './components/Vote.js';
import { MDBContainer, } from 'mdb-react-ui-kit';



function Home() {
  return (
    <MDBContainer fluid>
     
      <Table />
    </MDBContainer>
  );
}

function Submit() {
  return (
    <MDBContainer fluid>

      <Form />
    </MDBContainer>
  );
}

function Vote() {
  
  return (
    <MDBContainer fluid>
      <Submitvote />
      
    </MDBContainer>
  );
}

function About() {
  return (
    <MDBContainer fluid>
      <Aboutus />
      
    </MDBContainer>
  );
}



function App() {
  return (
    <>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit-proposal" element={<Submit />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/about" element={<About />} />
        </Routes>
        </>
  );
}

export default App;
