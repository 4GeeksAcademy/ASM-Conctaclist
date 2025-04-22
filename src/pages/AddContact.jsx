import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useGlobalReducer";

const AddContact = () => {
  const { store, getContact, createContact, updateContact } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    agenda_slug: "ASM"
  });

  useEffect(() => {
    if (id) {
      const loadContact = async () => {
        const contact = await getContact(id);
        if (contact) {
          setFormData({
            full_name: contact.full_name || "",
            email: contact.email || "",
            phone: contact.phone || "",
            address: contact.address || "",
            agenda_slug: "ASM"
          });
        }
      };
      loadContact();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.phone) {
      alert("Por favor, completa los campos obligatorios");
      return;
    }
    
    if (id) {
      await updateContact(id, formData);
    } else {
      await createContact(formData);
    }
    
    navigate("/");
  };

  return (
    <div className="container">
      <h1>{id ? "Editar Contacto" : "Añadir Nuevo Contacto"}</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="full_name" className="form-label">
            Nombre Completo*
          </label>
          <input
            type="text"
            className="form-control"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email*
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Teléfono*
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
        <div className="d-flex justify-content-between">
          <Link to="/" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary">
            {id ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContact;