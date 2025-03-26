import React, { useState, useEffect } from 'react';
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";

const FixedExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    monthlyAmount: '',
    startDate: '',
    totalInstallments: '',
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchExpenses = () => {
    api
      .get("/fixed-expenses")
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los gastos", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      api
        .put(`/fixed-expenses/${formData.id}`, formData)
        .then(() => {
          fetchExpenses();
          resetForm();
          toast.success("Gasto editado correctamente", { position: "top-right" });
        })
        .catch((error) => console.error('Error actualizando gasto', error));
    } else {
      api
        .post("/fixed-expenses", formData)
        .then(() => {
          fetchExpenses();
          resetForm();
          toast.success("Gasto creado correctamente", { position: "top-right" });
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message || "Error desconocido");
          } else {
            setErrorMessage("Error al realizar la solicitud");
          }
          setShowErrorModal(true);
        });
    }
  };

  const handleEdit = (expense) => {
    console.log(expense);
    setFormData(expense);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este gasto?")) {
      api
        .delete(`/fixed-expenses/${id}`)
        .then(() => {
          fetchExpenses();
          toast.success("Gasto eliminado correctamente", { position: "top-right" });
        })
        .catch((error) => {
          console.error('Error eliminando gasto', error);
          toast.error("Error al eliminar el gasto", { position: "top-right" });
        });
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      monthlyAmount: '',
      startDate: '',
      totalInstallments: '',
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Gestión de Gastos Fijos</h1>

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
              <label className="form-label">Pagos Restantes</label>
              <input
                type="number"
                name="totalInstallments"
                value={formData.totalInstallments}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-12 text-center">
              <button type="submit" className="btn btn-primary btn-lg" disabled={formData.nombre === '' || formData.monthlyAmount === '' || formData.startDate === ''}>
                {formData.id ? 'Actualizar Gasto' : 'Crear Gasto'}
              </button>
              {formData.id && (
                <button type="button" className="btn btn-secondary ms-3" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card shadow-lg p-4">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Monto Mensual</th>
              <th>Fecha de Inicio</th>
              <th>Pagos Restantes</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.name}</td>
                <td>{expense.monthlyAmount}</td>
                <td>{expense.startDate}</td>
                <td>{expense.remainingInstallments}</td>
                <td>{expense.isActive ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(expense)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expense.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </div>
  );
};

export default FixedExpensesPage;
