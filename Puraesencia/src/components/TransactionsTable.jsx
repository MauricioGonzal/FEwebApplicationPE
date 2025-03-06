import { FaDollarSign, FaRegCalendarAlt, FaUser, FaClipboard, FaShoppingCart } from "react-icons/fa";

const TransactionsTable = ({ transactions }) => {
    // Filtrar transacciones por categoría
    const cuotas = transactions.filter(t => ["Musculación", "Clases"].includes(t.transactionCategory.name));
    const bebidas = transactions.filter(t => t.transactionCategory.name === "Producto");
    const egresos = transactions.filter(t => t.transactionCategory.name === "Egreso");

    // Formatear moneda
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("es-ES", { style: "currency", currency: "ARS" }).format(amount);

    // Función para renderizar una tabla con columnas y datos personalizados
    const renderTable = (title, data, badgeColor, columns) => (
        <div className="mb-4 p-4">
            <h5 className="d-flex align-items-center">
                <span className={`badge bg-${badgeColor} p-2 me-2`}>{title}</span>
            </h5>
            {data.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-hover table-bordered shadow-sm rounded">
                        <thead className="table-dark text-center">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index}>{col.icon} {col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data.map((transaction, index) => (
                                <tr key={index} className="table-light">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex}>{col.render(transaction)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-muted">No hay registros en esta categoría.</p>
            )}
        </div>
    );

    return (
        <>
            {renderTable("Cuotas", cuotas, "primary", [
                { label: "Monto", icon: <FaDollarSign />, render: (t) => formatCurrency(t.amount) },
                { label: "Medio de pago", icon: "💳", render: (t) => t.paymentMethod.name },
                { label: "Usuario", icon: <FaUser />, render: (t) => t?.payment?.user?.fullName || "—" },
                { label: "Membresía", icon: "🏋️", render: (t) => t?.payment?.membership?.name || "—" },
                { label: "Fecha", icon: <FaRegCalendarAlt />, render: (t) => new Date(t.date).toLocaleString() },
            ])}

            {renderTable("Bebidas", bebidas, "success", [
                { label: "Producto", icon: <FaShoppingCart />, render: (t) => t.sale?.product.name || "—" },
                { label: "Cantidad", icon: "🔢", render: (t) => t.sale?.quantity || "—" },
                { label: "Total", icon: <FaDollarSign />, render: (t) => formatCurrency(t.amount) },
                { label: "Fecha", icon: <FaRegCalendarAlt />, render: (t) => new Date(t.date).toLocaleString() },
            ])}

            {renderTable("Egresos", egresos, "danger", [
                { label: "Descripción", icon: <FaClipboard />, render: (t) => t.comment || "Sin comentarios" },
                { label: "Monto", icon: <FaDollarSign />, render: (t) => formatCurrency(t.amount) },
                { label: "Método de pago", icon: "💳", render: (t) => t.paymentMethod.name },
                { label: "Fecha", icon: <FaRegCalendarAlt />, render: (t) => new Date(t.date).toLocaleString() },
            ])}
        </>
    );
};

export default TransactionsTable;
