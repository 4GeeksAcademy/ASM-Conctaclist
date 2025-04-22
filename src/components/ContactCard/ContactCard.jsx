import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";


const ContactCard = ({ contact, onDelete }) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-3">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Contacto"
                            className="img-fluid rounded-circle"
                        />
                    </div>
                    <div className="col-md-7">
                        <h3 className="card-title">{contact.full_name}</h3>
                        <div className="card-text">
                            <p>
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {contact.address || "No hay dirección disponible"}
                            </p>
                            <p>
                                <i className="fas fa-phone me-2"></i>
                                {contact.phone}
                            </p>
                            <p>
                                <i className="fas fa-envelope me-2"></i>
                                {contact.email}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex flex-column justify-content-around">
                        <Link to={`/edit/${contact.id}`} className="btn btn-warning mb-2">
                            <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <button
                            className="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target={`#deleteModal-${contact.id}`}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="modal fade" id={`deleteModal-${contact.id}`} tabIndex="-1" aria-labelledby={`deleteModalLabel-${contact.id}`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`deleteModalLabel-${contact.id}`}>Confirmar eliminación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro que deseas eliminar a {contact.full_name}?</p>
                            <p>Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={() => onDelete(contact.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ContactCard.propTypes = {
    contact: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired
};

export default ContactCard;