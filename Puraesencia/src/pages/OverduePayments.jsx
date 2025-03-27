import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";
import api from "../Api";
import { useNavigate } from "react-router-dom";

const OverduePayments = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchDay, setSearchDay] = useState("");
    
    useEffect(() => {
        api.get("/payments/getbystatus/pendiente")
            .then(response => {
                setPayments(response.data.sort((a, b) => new Date(a.dueDate).getDate() - new Date(b.dueDate).getDate()));
                setFilteredPayments(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error al cargar las cuotas vencidas:", error));
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchDay(query);
            setFilteredPayments(query ? payments.filter(p => {
            const dueDateDay = p.dueDate.slice(8, 10); 
            return dueDateDay === query.padStart(2, '0');
        }) : [...payments]);
    };
    

    if (loading) {
        return <div className="text-center mt-5"><h4>Cargando cuotas vencidas...</h4></div>;
    }

    return (
        <div className="container mt-4">
            <div className="input-group mb-3 w-50">
                <span className="input-group-text"><FaSearch /></span>
                <input type="number" className="form-control" placeholder="Buscar por día del mes..." value={searchDay} onChange={handleSearch} />
            </div>
            <table className="table table-bordered table-hover">
                <thead className="table-danger">
                    <tr>
                        <th>Fecha de Vencimiento</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.length > 0 ? filteredPayments.map((payment, index) => (
                        <tr key={index}>
                            <td>{new Date(payment.paymentDate + "T00:00:00").toLocaleDateString("es-ES")}</td>
                            <td>{payment.user.fullName}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" className="text-center">No hay cuotas vencidas</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>Volver</button>
        </div>
    );
};

export default OverduePayments;
