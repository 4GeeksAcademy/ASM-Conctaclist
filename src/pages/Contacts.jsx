import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ContactCard from "../components/ContactCard/ContactCard";
import { useStore } from "../hooks/useGlobalReducer";

const Contacts = () => {
  const { store, getContacts, deleteContact } = useStore();

  useEffect(() => {
    console.log("Contacts component mounted - fetching contacts");
    
    // Llamamos a getContacts y capturamos la respuesta para analizarla
    const fetchData = async () => {
      try {
        const contactsData = await getContacts();
        console.log("Contactos recibidos:", contactsData);
        console.log("Estado después de cargar contactos:", store);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
      }
    };
    
    fetchData();
  }, []);

  // Añadimos logs para entender el estado actual
  console.log("Renderizando componente Contacts");
  console.log("Store actual:", store);
  console.log("Contacts en store:", store.contacts);
  console.log("¿Es un array?", Array.isArray(store.contacts));

  // Verificar si store.contacts es un array antes de usar map
  const contacts = Array.isArray(store.contacts) ? store.contacts : [];
  console.log("Contacts a mostrar:", contacts);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Contactos</h1>
        <Link to="/add" className="btn btn-success">
          Añadir nuevo contacto
        </Link>
      </div>

      {/* Añadimos más información para depuración */}
      <div className="mb-3">
        <p>Estado de la carga: {contacts.length > 0 ? 'Contactos cargados' : 'Sin contactos o carga pendiente'}</p>
      </div>

      {contacts.length === 0 ? (
        <div className="alert alert-warning">
          No hay contactos disponibles. ¡Añade uno nuevo!
        </div>
      ) : (
        contacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact} 
            onDelete={deleteContact}
          />
        ))
      )}
    </div>
  );
};

export default Contacts;