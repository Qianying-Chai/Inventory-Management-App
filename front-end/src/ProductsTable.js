import React, { useEffect, useContext } from 'react'
import { Table } from 'react-bootstrap'
import { ProductContext, UpdateProductContext, SupplierContext } from './ProductContext'
import ProductsRow from './components/ProductsRow';
import { Navigate, useNavigate } from 'react-router-dom';


const ProductsTable = () => {
    const { products, setProducts, displayedProducts } = useContext(ProductContext);
    const { setUpdateProductInfo } = useContext(UpdateProductContext)
    const { setSupplierInfo } = useContext(SupplierContext)
    const navigate = useNavigate()


    useEffect(() => {
        fetch("http://127.0.0.1:8000/product").then(resp => {
            return resp.json();
        }).then(results => {
            setProducts({ "data": [...results.data] });
        }
        )
    }, [])


    const HandleDelete = async (id) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/product/" + id, {
                method: "DELETE",
                headers: {
                    accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === "ok") {
                const filteredProducts = products.data.filter(product => product.id !== id);
                setProducts({ "data": filteredProducts });
                alert("Product deleted successfully");
            } else {
                alert("Product deletion failed: " + (result.message || "Unknown error"));
            }

        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product: " + error.message);
        }
    }




    const HandleUpdate = (name, quantity_in_stock, quantity_sold, unit_price, revenue, id, supplier_id) => {

        setUpdateProductInfo({
            ProductName: name,
            QuantityInStock: quantity_in_stock,
            QuantitySold: quantity_sold,
            UnitPrice: unit_price,
            Revenue: revenue,
            ProductId: id,
            SupplierId: supplier_id || ''

        });

        navigate("/updateproduct");


    }

    const HandleSupplier = (supplier_id) => {
        fetch("http://localhost:8000/supplier/" + supplier_id, {
            headers: {
                Accept: 'application/json'
            }
        }).then(resp => {
            return resp.json()
        }).then(result => {
            if (result.status === 'ok') {
                setSupplierInfo({ ...result.data })
                navigate("/supplierpage");
            }
            else {
                alert("error")
            }
        })
    }

    const AddSupplier = (product_id) => {
        navigate(`/addsupplier/${product_id}`);
    }

    return (
        <Table striped bordered hover  >
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Product Name</th>
                    <th>Quantity In Stock</th>
                    <th>Quantity Sold</th>
                    <th>Unit Price</th>
                    <th>Revenue</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {(displayedProducts?.data.length ? displayedProducts.data : products.data).map((product) =>
                    <ProductsRow
                        key={product.id}
                        id={product.id}
                        supplier_id={product.supplier_id}
                        name={product.name}
                        quantity_in_stock={product.quantity_in_stock}
                        quantity_sold={product.quantity_sold}
                        unit_price={product.unit_price}
                        revenue={product.revenue}
                        HandleDelete={HandleDelete}
                        HandleUpdate={HandleUpdate}
                        HandleSupplier={HandleSupplier}
                        AddSupplier={AddSupplier} />
                )}
            </tbody>
        </Table>


    )

}

export default ProductsTable
