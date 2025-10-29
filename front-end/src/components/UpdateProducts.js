import react, { useState, useContext } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import './Product.css';
import { useNavigate } from 'react-router-dom';
import { UpdateProductContext, ProductContext } from "../ProductContext"
const UpdateProducts = () => {

    const navigate = useNavigate();
    const { updateProductInfo, setUpdateProductInfo } = useContext(UpdateProductContext)

    const HandleUpdateProducts = (e) => {
        setUpdateProductInfo({ ...updateProductInfo, [e.target.name]: e.target.value })
    }

  

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()

          const quantityInStock = Number(updateProductInfo.QuantityInStock);
          const quantitySold = Number(updateProductInfo.QuantitySold);
          const unitPrice = Number(updateProductInfo.UnitPrice);
          
          if (!updateProductInfo.ProductName || updateProductInfo.ProductName.trim() === '') {
              alert("Product Name is required!");
              return;
          }
  
          if (isNaN(quantityInStock)) {
              alert("Quantity In Stock must be a valid number!");
              return;
          }
          

          if (quantityInStock < 0) {
              alert("Quantity In Stock cannot be negative!");
              return;
          }
          

          if (isNaN(quantitySold)) {
              alert("Quantity Sold must be a valid number!");
              return;
          }
          

          if (quantitySold < 0) {
              alert("Quantity Sold cannot be negative!");
              return;
          }
          

          if (isNaN(unitPrice)) {
              alert("Unit Price must be a valid number!");
              return;
          }
          
 
          if (unitPrice < 0) {
              alert("Unit Price cannot be negative!");
              return;
          }
          
        const url = "http://127.0.0.1:8000/product/" + updateProductInfo.ProductId


        try {

            const response = await fetch(url, {
                method: "PUT",
                mode: 'cors',
                cache: "no-cache",
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": updateProductInfo.ProductName,
                    "quantity_in_stock": Number(updateProductInfo.QuantityInStock),
                    "quantity_sold": Number(updateProductInfo.QuantitySold),
                    "unit_price": Number(updateProductInfo.UnitPrice),
                    "supplier_id": updateProductInfo.SupplierId ? Number(updateProductInfo.SupplierId) : null
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const resp = await response.json()

            if (resp.status === "ok") {
                alert("Product updated");
            } else {
                alert("Failed to update product" + resp.message)
            }

        } catch (error) {
            alert("Error updating product: " + error.message)
        }



        navigate("/")

    }




    return (<Card>
        <Card.Body>
            <Form onSubmit={handleUpdateSubmit} >
                <Form.Group controlId="ProductName" className="form-group"
                >
                    <Form.Label className="form-label">Product Name</Form.Label>
                    <Form.Control type="text" name="ProductName"
                        placeholder="Product Name" value={updateProductInfo.ProductName} onChange={HandleUpdateProducts} />
                </Form.Group>

                <Form.Group controlId="QuantityInStock" className="form-group">
                    <Form.Label className="form-label">Quantity In Stock</Form.Label>
                    <Form.Control type="number" name="QuantityInStock"
                        placeholder="Quantity In Stock"
                        value={updateProductInfo.QuantityInStock}
                        onChange={HandleUpdateProducts} />
                </Form.Group>

                <Form.Group controlId="QuantitySold" className="form-group">
                    <Form.Label className="form-label">Quantity Sold</Form.Label>
                    <Form.Control type="number" name="QuantitySold" placeholder="Quantity Sold"
                        value={updateProductInfo.QuantitySold} onChange={HandleUpdateProducts} />
                </Form.Group>

                <Form.Group controlId="UnitPrice" className="form-group">
                    <Form.Label className="form-label">Unit Price</Form.Label>
                    <Form.Control type="number" name="UnitPrice" placeholder="Unit Price"
                        value={updateProductInfo.UnitPrice} onChange={HandleUpdateProducts}
                    />
                </Form.Group>

                <Form.Group controlId="SupplierId" className="form-group">
                    <Form.Label className="form-label">Supplier Id</Form.Label>
                    <Form.Control type="number" name="SupplierId" value={updateProductInfo.SupplierId} onChange={HandleUpdateProducts}
                        placeholder="Supplier Id" />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: "1rem" }}>
                    Submit
                </Button>
            </Form>
        </Card.Body>
    </Card>
    )

}

export default UpdateProducts;