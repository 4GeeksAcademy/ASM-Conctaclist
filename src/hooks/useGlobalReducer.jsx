import React, { useReducer, createContext, useContext } from "react";
import { initialStore } from "../store";


export const StoreContext = createContext();

const actions = {
    GET_CONTACTS: "GET_CONTACTS",
    ADD_CONTACT: "ADD_CONTACT",
    UPDATE_CONTACT: "UPDATE_CONTACT",
    DELETE_CONTACT: "DELETE_CONTACT",
    SELECT_CONTACT: "SELECT_CONTACT"
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.GET_CONTACTS:
            return { ...state, contacts: action.payload };
        case actions.ADD_CONTACT:
            return { ...state, contacts: [...state.contacts, action.payload] };
        case actions.UPDATE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.map(contact =>
                    contact.id === action.payload.id ? action.payload : contact
                )
            };
        case actions.DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact.id !== action.payload)
            };
        case actions.SELECT_CONTACT:
            return { ...state, selectedContact: action.payload };
        default:
            return state;
    }
};

const useGlobalReducer = () => {
    const [store, dispatch] = useReducer(reducer, initialStore);

    const BASE_URL = 'https://playground.4geeks.com/contact';
    const AGENDA_SLUG = 'ASM';

    const getContacts = async () => {
        try {
            const url = `${BASE_URL}/agendas/${AGENDA_SLUG}`;
            console.log("Obteniendo contactos de:", url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la respuesta:", errorText);
                throw new Error(`Error al cargar los contactos: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Datos recibidos:", data);
            
            // Extraer el array de contactos del objeto respuesta
            let contactsArray;
            if (data && data.contacts && Array.isArray(data.contacts)) {
                contactsArray = data.contacts;
            } else if (Array.isArray(data)) {
                contactsArray = data;
            } else {
                console.error("Formato de datos inesperado:", data);
                contactsArray = [];
            }
            
            
            const processedContacts = contactsArray.map(contact => ({
                id: contact.id,
                full_name: contact.name || contact.full_name || '',
                email: contact.email || '',
                phone: contact.phone || '',
                address: contact.address || '',
                agenda_slug: contact.agenda_slug || AGENDA_SLUG
            }));
            
            console.log("Contactos procesados:", processedContacts);
            dispatch({ type: actions.GET_CONTACTS, payload: processedContacts });
            return processedContacts;
        } catch (error) {
            console.error("Error al obtener contactos:", error);
            return [];
        }
    };


    const getContact = async (id) => {
        try {
            const url = `${BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`;
            console.log("Fetching contact details from:", url);

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Error al cargar el contacto: ${response.status}`);
            }

            const data = await response.json();
            console.log("Contact data:", data);
            return data;
        } catch (error) {
            console.error(`Error fetching contact with id ${id}:`, error);
            return null;
        }
    };

    const createContact = async (contact) => {
        try {
            console.log("Creating contact:", contact);
            const contactData = {
                name: contact.full_name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                agenda_slug: AGENDA_SLUG
            };
            const response = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Error al crear el contacto: ${response.status}`);
            }

            console.log("Contact created successfully");
            getContacts();
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    const updateContact = async (id, contact) => {
        try {
            console.log("Updating contact:", id, contact);
            const contactData = {
                name: contact.full_name,
                email: contact.email,
                phone: contact.phone,
                address: contact.address,
                agenda_slug: AGENDA_SLUG
            };
            const response = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Error al actualizar el contacto: ${response.status}`);
            }

            console.log("Contact updated successfully");
            getContacts();
        } catch (error) {
            console.error("Error updating contact:", error);
        }
    };

    const deleteContact = async (id) => {
        try {
            console.log("Deleting contact:", id);
            const response = await fetch(`${BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Error al eliminar el contacto: ${response.status}`);
            }

            console.log("Contact deleted successfully");
            dispatch({ type: actions.DELETE_CONTACT, payload: id });
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const selectContact = (contact) => {
        dispatch({ type: actions.SELECT_CONTACT, payload: contact });
    };

    return {
        store,
        getContacts,
        getContact,       // Añadida la función getContact
        createContact,
        updateContact,
        deleteContact,
        selectContact
    };
};


export const StoreProvider = ({ children }) => {
    const storeValues = useGlobalReducer();

    return (
        <StoreContext.Provider value={storeValues}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore debe usarse dentro de un StoreProvider");
    }
    return context;
};

export default useGlobalReducer;