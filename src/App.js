import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table,Button,Conteiner,Modal, ModalBody,modalHeader,FormGroup,ModelFooter, ModalHeader, ModalFooter}from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { render } from '@testing-library/react';
import axios from'axios';


function App (){
  const baseUrl="https://localhost:44303/api/getmascotas";
  const [data,setData]=useState([]);
  const [modalInsertar,setModalInsertar]=useState(false);
  const [modalEditar,setModalEditar]=useState(false);
  const [modalEliminar,setModalEliminar]=useState(false);

  const [gestorSeleccionado,setGestorSeleccionado]=useState({
    Codigo :"",
    Nombre:"",
    Tamanio:""
  })
  const handleChange=e=>{
    const {name,value}=e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]:value
    });
    console.log(gestorSeleccionado)
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar)
  }
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar)
  }
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar)
  }
  const peticionesGet = async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).cath(error=>{
      console.log(error);
    })
  }

  const peticionesPost = async()=>{
    delete gestorSeleccionado.id;
    await axios.post(baseUrl,gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrerModalInsertar();
    }).cath(error=>{
      console.log(error);
    })
  }
  const peticionesPut = async()=>{
    
    await axios.put(baseUrl+"/"+gestorSeleccionado.Codigo,gestorSeleccionado)
    .then(response=>{
      var respuestra= response.data;
      var datAux= data;
      datAux.map(gestor => {
        if(gestor.Codigo===gestorSeleccionado.Codigo){
          gestor.Nombre=respuestra.Nombre;
          gestor.Tamanio=respuestra.Tamanio;
        }
      }
    )}).cath(error=>{
      console.log(error);
    })
  }

  const peticioneDelete = async()=>{
    
    await axios.delete(baseUrl+"/"+gestorSeleccionado.Codigo,gestorSeleccionado)
    .then(response=>{
    setData(data.filter(gestor=>gestor.Codigo!==response.data));
    abrirCerrarModalEliminar();

    }).cath(error=>{
      console.log(error);
    })
  }

  const seleccionaGestor=(gestor,caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")&& 
    abrirCerrarModalEditar();abrirCerrarModalEliminar();
  }
  useEffect(()=>{
    peticionesGet();
  },[])
  return(

    <div className="App">
      <br></br>
      <button onClick={()=>abrirCerrerModalInsertar()} className= "btn btn-success">Insertar nuevo gestor</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Codigo</th>
              <th>Nombre</th>
              <th>Tamanio</th>
          </tr>
        </thead>
            
       <tbody>
         {data.map(gestor=>(
           <tr key={gestor.id}>
             <td>{gestor.Codigo}</td>
             <td>{gestor.Nombre}</td>
             <td>{gestor.Tamanio}</td>
             
             <td>
             <button className='btn btn-primary' onClick={()=>seleccionarGestor(gestor,"Editar")} >Editar</button>{"   "}
             <button className='btn btn-danger' onClick={()=>seleccionarGestor(gestor,"Eliminar")} >Eliminar</button>

             </td>
             </tr>
         ))} 
      </tbody>
      </table>
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre:</label>
            <br />
            <input type="text" className='form-control' name="Nombre" onChange={handleChange}/>
            <br />
            <label>Tamanio:</label>
            <br />
            <input type="text" className='form-control' name="Tamanio" onChange={handleChange}/>
            <br />
            </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary'onClick={()=>peticionesPost()}>Insertar</button>{"   "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalInsertar}>Cancelar</button>
        </ModalFooter>

    
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Gestor de Base de Datos</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Codigo:</label>
            <br />
            <input type="text" className='form-control' name="Codigo" readOnly value= { gestorSeleccionado && gestorSeleccionado.Codigo}/>
            <br />
            <label>Nombre:</label>
            <br />
            <input type="text" className='form-control' name="Nombre" readOnly value= { gestorSeleccionado && gestorSeleccionado.Nombre}/>
            <br />
            <label>Tamanio:</label>
            <br />
            <input type="text" className='form-control' name="Tamanio" onChange={handleChange} value=  { gestorSeleccionado && gestorSeleccionado.Tamanio}/>
            <br />
            </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary'onClick={()=>peticionesPut()}>Insertar</button>{"   "}
          <button className='btn btn-danger' onClick={()=>abrirCerrarModalEditar}>Cancelar</button>
        </ModalFooter>

    
      </Modal>
      
      <Modal>
        <ModalBody>
          Estas seguro de querer eliminar la db
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={()=>peticioneDelete()}>Si</button>
          <button className='btn btn-secomdary'>No</button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default App;
