import react from 'react'


const ProductsRow = ({ id, supplier_id, name, quantity_in_stock, quantity_sold, unit_price, revenue, HandleDelete, HandleUpdate, HandleSupplier, AddSupplier }) => {


    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{quantity_in_stock}</td>
            <td>{quantity_sold}</td>
            <td>{unit_price}</td>
            <td>{revenue}</td>
            <td className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-info btn-sm ml-1 mr-2" onClick={() => { HandleUpdate(name, quantity_in_stock, quantity_sold, unit_price, revenue, id, supplier_id) }}>
                    Update
                </button>
                <button className="btn btn-outline-danger btn-sm mr-2" onClick={() => HandleDelete(id)}>Delete</button>
                {supplier_id ? (
                    <button
                        className="btn btn-outline-success btn-sm mr-2"
                        onClick={() => HandleSupplier(supplier_id)}
                    >
                        Manage Supplier
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-success btn-sm mr-2"
                        style={{ padding: '0 21px' }}
                        onClick={() => AddSupplier(id)}
                    >
                        Add Supplier
                    </button>
                )}
            </td>
        </tr>
    );
}

export default ProductsRow