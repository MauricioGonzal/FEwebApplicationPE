import { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Card, Spinner } from "react-bootstrap";
import api from "../Api";
import { toast } from 'react-toastify';
import ErrorModal from "../components/ErrorModal";
import { MembershipsTable } from "../components/MembershipsTable";
import ConfirmationDeleteModal from "../components/ConfirmationDeleteModal";

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [simpleMemberships, setSimpleMemberships] = useState([]);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editingMembership, setEditingMembership] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", area: "", maxDays: "", maxClasses: "", prices: {} });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState(null);

  const [areas, setAreas] = useState([]);
  const [membershipTypes, setMembershipTypes] = useState([]); // "simple" o "combinada"
  const [selectedMembershipType, setSelectedMembershipType] = useState("");
  const [selectedMembershipsToCombine, setSelectedMembershipsToCombine] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    api.get("/membership-type")
    .then((response) => setMembershipTypes(response.data))
    .catch((error) => console.error("Error al obtener tipo de membresias", error));

    api.get("/area")
      .then((response) => setAreas(response.data))
      .catch((error) => console.error("Error al obtener áreas", error));

    api.get("/payment-methods")
      .then((response) => setPaymentMethods(response.data))
      .catch((error) => console.error("Error al obtener métodos de pago", error));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get("/membership/priceList")
      .then((response) => {setMemberships(response.data);})
      .catch((error) => console.error("Error al obtener membresías", error))
      .finally(() => setLoading(false));

      api.get("/membership/priceList/simples")
      .then((response) => {setSimpleMemberships(response.data);})
      .catch((error) => console.error("Error al obtener membresías", error))
      
  }, [refresh]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "area") {
      const selectedAreaObj = areas.find(area => area.id.toString() === value);
      setSelectedArea(selectedAreaObj);
      setFormValues(prev => ({ ...prev, area: selectedAreaObj }));
    }
    else if(name === "membershipType"){
      const selectedMembershipTypeObj = membershipTypes.find(type => type.id.toString() === value);
      setSelectedMembershipType(selectedMembershipTypeObj);
      setFormValues(prev => ({ ...prev, membershipType: selectedMembershipTypeObj }));
    }
    else {
      setFormValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmountChange = (e, paymentMethodId) => {
    const { value } = e.target;
    setFormValues(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        [paymentMethodId]: parseFloat(value)
      }
    }));
  };

  const handleDelete = () => {
    api.post('/membership/delete-with-price', item)
    .then(() => {
      setRefresh(prev => !prev); // Refresca el estado después de eliminar
      toast.success("Membresía eliminada exitosamente");
      setShowModal(false);
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Error desconocido");
      } else {
        setErrorMessage("Error al realizar la solicitud");
      }
      setShowErrorModal(true);
      setShowModal(false);
    });
  };

  const handleShowModal = (item) => {
    setItem(item);
    setShowModal(true);
  };

  const handleEdit = (membership) => {
    setEditingMembership(membership);
  
    const prices = membership.priceLists.reduce((acc, price) => {
      acc[price.paymentMethod.id] = price.amount;
      return acc;
    }, {});
  
    setFormValues({
      name: membership.membership.name,
      area: membership.membership.area,
      maxDays: membership.membership.maxDays || "",
      maxClasses: membership.membership.maxClasses || "",
      prices: prices,
    });
  
    setSelectedMembershipType(membership.membership.membershipType);
  
    if (membership.membership.membershipType.name === "Combinada") {
      const combinedIds = membership.membershipsAssociated.map((m) => m.id.toString());
      setSelectedMembershipsToCombine(combinedIds);
    } else {
      setSelectedArea(membership.membership.area);
      setSelectedMembershipsToCombine([]);
    }
  };
  

  const handleSave = async (event) => {
    event.preventDefault();

    if(selectedMembershipType.name === "Combinada" && selectedMembershipsToCombine.length < 2){
      setErrorMessage("Debe seleccionar dos o mas membresías");
      setShowErrorModal(true);
      return;
    }

    const membershipRequest = {
      name: formValues.name,
      maxDays: selectedArea?.name === "Musculacion" ? formValues.maxDays : null,
      maxClasses: selectedArea?.name === "Clases" ? formValues.maxClasses : null,
      prices: formValues.prices,
      area: selectedArea === "" ? null : selectedArea ,
      membershipType: selectedMembershipType,
      combinedMembershipIds: selectedMembershipType.name === "Combinada" ? selectedMembershipsToCombine : []
    };

    if (editingMembership) {
      api.put('/membership/update/' + editingMembership.membership.id, membershipRequest)
        .then(() => {
          toast.success("Membresía editada correctamente");
          setRefresh(prev => !prev);
          setEditingMembership(null);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Error desconocido");
          setShowErrorModal(true);
        });
    } else {
      api.post('/membership/create-membership-price', membershipRequest)
        .then(() => {
          toast.success("Membresía creada correctamente");
          setRefresh(prev => !prev);
        })
        .catch((error) => {
          setErrorMessage(error.response?.data?.message || "Error desconocido");
          setShowErrorModal(true);
        });
    }

    // Reset form
    setFormValues({ name: "", area: "", maxDays: "", maxClasses: "", prices: {} });
    setSelectedMembershipType("");
    setSelectedMembershipsToCombine([]);
    setSelectedArea("");
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">{editingMembership ? "Editar Membresía" : "Crear Membresía"}</h3>
              <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Membresía</Form.Label>
                <Form.Select name="membershipType" value={selectedMembershipType === undefined ? "" : selectedMembershipType.id} onChange={handleInputChange} required>
                    <option value="">Seleccione tipo de membresia</option>
                    {membershipTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </Form.Select>
              </Form.Group>


              {selectedMembershipType.name === "Combinada" && (
                <Form.Group className="mb-3">
                  <Form.Label>Seleccionar membresías simples a combinar</Form.Label>
                  <Form.Select
  multiple
  value={selectedMembershipsToCombine}
  onChange={(e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedMembershipsToCombine(selectedOptions);
  }}
>
  {simpleMemberships.map((m) => (
    <option key={m.membership.id} value={m.membership.id}>
      {m.membership.name}
    </option>
  ))}
</Form.Select>
                </Form.Group>
              )}

              {selectedMembershipType.name === "Simple" && (
                  <Form.Group className="mb-3">
                  <Form.Label>Área</Form.Label>
                  <Form.Select name="area" value={selectedArea === undefined ? "" : selectedArea.id} onChange={handleInputChange} required>
                    <option value="">Seleccione un área</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}


                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="name" value={formValues.name} onChange={handleInputChange} required />
                </Form.Group>

                {selectedArea?.name === "Musculacion" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de días</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxDays"
                      value={formValues.maxDays}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}

                {selectedArea?.name === "Clases" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de clases</Form.Label>
                    <Form.Control
                      type="number"
                      name="maxClasses"
                      value={formValues.maxClasses}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}

                {paymentMethods.map((paymentMethod) => (
                  <Form.Group key={paymentMethod.id} className="mb-3">
                    <Form.Label>Monto ({paymentMethod.name})</Form.Label>
                    <Form.Control
                      type="number"
                      name={`amount-${paymentMethod.id}`}
                      value={formValues.prices[paymentMethod.id] || ""}
                      onChange={(e) => handleAmountChange(e, paymentMethod.id)}
                    />
                  </Form.Group>
                ))}

                <Button type="submit" variant="primary" block>{editingMembership ? "Actualizar" : "Crear"}</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ConfirmationDeleteModal showModal={showModal} setShowModal={setShowModal} message={`Seguro que quieres eliminar la membresía ${item?.membership.name}`} handleDelete={handleDelete} />
      <MembershipsTable memberships={memberships} handleEdit={handleEdit} paymentMethods={paymentMethods} handleShowModal={handleShowModal}/>
      <ErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} errorMessage={errorMessage} />
    </Container>
  );
};

export default MembershipsPage;
