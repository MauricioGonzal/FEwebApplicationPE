const TransactionsTable = ({ transactions }) => {
    return (
        <>
        <h5 className="mt-4">Movimientos del dia</h5>
        <div className="table-responsive">
            <table className="table table-hover table-bordered shadow-sm">
                <thead className="table-dark text-center">
                    <tr>
                        <th>Monto</th>
                        <th>Medio de pago</th>
                        <th>Categoria</th>
                        <th>Usuario</th>
                        <th>Comentario</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>${transaction.amount}</td>
                            <td>{transaction.paymentMethod.name}</td>
                            <td>{transaction.transactionCategory.name}</td>
                            <td>{transaction?.user?.fullName}</td>
                            <td>{transaction.comment}</td>
                            <td>{new Date(transaction.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default TransactionsTable;
