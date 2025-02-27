import React, { useState, useEffect } from 'react';
import api from "../Api";


const FixedExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    monthlyAmount: '',
    startDate: '',
    remainingInstallments: '',
  });

  const fetchExpenses = (() => {
    api
      .get("/fixed-expenses")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los precios", error);
      });
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = ((e) => {
    e.preventDefault();
    try {
      api
      .post("/fixed-expenses", formData)
      .then((response) => {
        console.log('Expense created', response.data);
        fetchExpenses(); // Vuelve a cargar la lista de gastos
        setFormData({
          name: '',
          totalAmount: '',
          monthlyAmount: '',
          startDate: '',
          remainingInstallments: '',
        });
      })
    } catch (error) {
      console.error('Error creating expense', error);
    }
  });

  useEffect(() => {
    fetchExpenses(); // Cargar los gastos fijos cuando se monte el componente
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Gastos Fijos</h1>

      {/* Formulario para crear gasto fijo */}
      <div className="card shadow-lg p-4 mb-5">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Monto Total</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="form-control"
                step="0.01"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Monto Mensual</label>
              <input
                type="number"
                name="monthlyAmount"
                value={formData.monthlyAmount}
                onChange={handleChange}
                className="form-control"
                step="0.01"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Cuotas Restantes</label>
              <input
                type="number"
                name="remainingInstallments"
                value={formData.remainingInstallments}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-primary btn-lg">Crear Gasto</button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de los gastos fijos */}
      <div className="card shadow-lg p-4">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Monto Total</th>
              <th>Monto Mensual</th>
              <th>Fecha de Inicio</th>
              <th>Cuotas Restantes</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.name}</td>
                <td>{expense.totalAmount}</td>
                <td>{expense.monthlyAmount}</td>
                <td>{expense.startDate}</td>
                <td>{expense.remainingInstallments}</td>
                <td>{expense.isActive ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedExpensesPage;
