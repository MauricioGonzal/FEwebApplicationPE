import React, { useState, useEffect } from "react";
import api from "../Api";

export default function Transactions() {
  const [filtros, setFiltros] = useState({
    paymentMethod: "",
    transactionCategory: "",
    since: "",
    until: "",
  });

  const [transacciones, setTransacciones] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [filtradas, setFiltradas] = useState([]);

  useEffect(() => {
    api.get('/transaction')
      .then((res) => {
        setTransacciones(res.data);
        setFiltradas(res.data);
      })
      .catch((err) => console.error("Error al obtener transacciones", err));

    api.get('/payment-method')
      .then((res) => setPaymentMethods(res.data))
      .catch((err) => console.error("Error al obtener medios de pago", err));

    api.get('/transaction-category')
      .then((res) => setTransactionCategories(res.data))
      .catch((err) => console.error("Error al obtener categorías", err));
  }, []);

  useEffect(() => {
    let resultado = [...transacciones];

    if (filtros.paymentMethod) {
      resultado = resultado.filter(t => t.paymentMethod.name === filtros.paymentMethod);
    }

    if (filtros.transactionCategory) {
      resultado = resultado.filter(t => t.transactionCategory.name === filtros.transactionCategory);
    }

    if (filtros.since) {
      resultado = resultado.filter(t => t.date >= filtros.since);
    }

    if (filtros.until) {
      resultado = resultado.filter(t => t.date <= filtros.until);
    }

    setFiltradas(resultado);
  }, [filtros, transacciones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">📊 Transacciones</h1>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filtros</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-select"
                name="paymentMethod"
                value={filtros.paymentMethod}
                onChange={handleChange}
              >
                <option value="">-- Medio de Pago --</option>
                {paymentMethods.map((medio) => (
                  <option key={medio.id} value={medio.name}>
                    {medio.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-select"
                name="transactionCategory"
                value={filtros.transactionCategory}
                onChange={handleChange}
              >
                <option value="">-- Categoría --</option>
                {transactionCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                name="since"
                value={filtros.since}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                name="until"
                value={filtros.until}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Medio</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                </tr>
              </thead>
                <tbody>
                    {filtradas.length === 0 ? (
                        <tr>
                        <td colSpan="4" className="text-center p-4">
                            No hay transacciones que coincidan con los filtros.
                        </td>
                        </tr>
                    ) : (
                        filtradas.map((t) => (
                        <tr key={t.id}>
                            <td className="p-2 border">
                            {new Date(t.date).toLocaleDateString("es-AR")}
                            </td>
                            <td className="p-2 border">{t.paymentMethod.name}</td>
                            <td className="p-2 border">{t.transactionCategory.name}</td>
                            <td className="p-2 border">${t.amount}</td>
                        </tr>
                        ))
                    )}
                </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
