import { Table, Button } from "react-bootstrap";
import styles from '../css/MembershipsPage.module.css';

export function MembershipsTable ({ memberships, handleEdit, handleShowModal, paymentMethods }) {
    console.log(memberships);
    return (
        <Table striped bordered hover className={`${styles.table} mt-4`}>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Máx. Días</th>
                    <th>Máx. Clases</th>
                    {/* Generar headers para cada PaymentMethod */}
                    {paymentMethods.map((paymentMethod) => (
                        <th key={paymentMethod.id}>Valor {paymentMethod.name}</th>
                    ))}
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {memberships.map((record) => (
                    <tr key={record.membership.id}>
                        <td>{record.membership.name}</td>
                        <td>{record.membership.transactionCategory.name}</td>
                        <td>{record.membership.maxDays || "-"}</td>
                        <td>{record.membership.maxClasses || "-"}</td>
                        {/* Buscar el valor correspondiente para cada PaymentMethod */}
                        {paymentMethods.map((paymentMethod) => {
                            // Buscar el priceList correspondiente al PaymentMethod actual
                            const priceList = record.priceLists.find(pl => pl.paymentMethod.id === paymentMethod.id);
                            return (
                                <td key={paymentMethod.id}>
                                    {/* Si no hay precio para este PaymentMethod, se muestra "-" */}
                                    {priceList ? `$${priceList.amount}` : "-"}
                                </td>
                            );
                        })}
                        <td>
                            <Button variant="warning" onClick={() => handleEdit(record)}>Editar</Button>
                            <Button variant="danger" onClick={() => handleShowModal(record)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
