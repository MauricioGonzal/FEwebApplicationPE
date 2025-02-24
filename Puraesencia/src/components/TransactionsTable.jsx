const TransactionsTable = ({ transactions }) => {
    // Filtrar transacciones por categoría
    const cuotas = transactions.filter(t => t.transactionCategory.name === "Musculacion");
    const bebidas = transactions.filter(t => t.transactionCategory.name === "Producto");
    const egresos = transactions.filter(t => t.transactionCategory.name === "Egreso");

    // Función para renderizar una tabla con las transacciones filtradas
    const renderTable = (title, data) => (
        <>
            <h5 className="mt-4">{title}</h5>
            {data.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Monto</th>
                                <th>Medio de pago</th>
                                <th>Usuario</th>
                                <th>Comentario</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data.map((transaction, index) => (
                                <tr key={index}>
                                    <td>${transaction.amount}</td>
                                    <td>{transaction.paymentMethod.name}</td>
                                    <td>{transaction?.user?.fullName || ""}</td>
                                    <td>{transaction.comment}</td>
                                    <td>{new Date(transaction.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">No hay registros en esta categoría.</p>
            )}
        </>
    );

    return (
        <>
            {renderTable("Cuotas", cuotas)}
            {renderTable("Bebidas", bebidas)}
            {renderTable("Egresos", egresos)}
        </>
    );
};

export default TransactionsTable;
