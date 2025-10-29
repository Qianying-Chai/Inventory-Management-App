import react, { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import './Product.css';
import { useNavigate,} from 'react-router-dom';


const AddProducts = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        ProductName: '',
        QuantityInStock: 0,
        QuantitySold: 0,
        UnitPrice: 0,
        Revenue: 0,
        SupplierId: ''
    })

    const updateProduct = (e) => {
       setProduct({ ...product, [e.target.name]: e.target.value })

    }


    const productFormSubmit = async (e) => {
        e.preventDefault();

    const quantityInStock = Number(product.QuantityInStock);
    const quantitySold = Number(product.QuantitySold);
    const unitPrice = Number(product.UnitPrice);
    
    if (!product.ProductName || product.ProductName.trim() === '') {
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
        
        const supplierId = product['SupplierId'];

        const url = supplierId 
            ? `http://localhost:8000/product/${supplierId}`
            : `http://localhost:8000/product`;


        try {
            const response = await fetch(
                url, {
                method: "POST",
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json"
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    'name': product.ProductName,
                    'quantity_in_stock': product.QuantityInStock,
                    'quantity_sold': product.QuantitySold,
                    'unit_price': product.UnitPrice,
                    
                })
            }

            )

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === "ok") {
                alert("Product added successfully")
            } else {
                alert("Failed to add product, please check your input")
            }

            setProduct({
                ProductName: '',
                QuantityInStock: 0,
                QuantitySold: 0,
                UnitPrice: 0,
                Revenue: 0,
                SupplierId: ''
            });
            navigate("/")

        } catch (error) {
            alert("Error: " + error.message);
        }


    }

    return (
        <Card>
            <Card.Body>
                <Form onSubmit={productFormSubmit} >
                    <Form.Group controlId="ProductName" className="form-group"
                    >
                        <Form.Label className="form-label">Product Name</Form.Label>
                        <Form.Control type="text" name="ProductName" value={product.ProductName} onChange={updateProduct}
                            placeholder="Product Name" />
                    </Form.Group>

                    <Form.Group controlId="QuantityInStock" className="form-group">
                        <Form.Label className="form-label">Quantity In Stock</Form.Label>
                        <Form.Control type="number" name="QuantityInStock" value={product.QuantityInStock} onChange={updateProduct}
                            placeholder="Quantity In Stock" />
                    </Form.Group>

                    <Form.Group controlId="QuantitySold" className="form-group">
                        <Form.Label className="form-label">Quantity Sold</Form.Label>
                        <Form.Control type="number" name="QuantitySold" placeholder="Quantity Sold" value={product.QuantitySold} onChange={updateProduct} />
                    </Form.Group>

                    <Form.Group controlId="UnitPrice" className="form-group">
                        <Form.Label className="form-label">Unit Price</Form.Label>
                        <Form.Control type="number" name="UnitPrice" value={product.UnitPrice} onChange={updateProduct} placeholder="Unit Price" />
                    </Form.Group>
                    <Form.Group controlId="SupplierId" className="form-group">
                        <Form.Label className="form-label">Supplier Id</Form.Label>
                        <Form.Control type="number" name="SupplierId" value={product.SupplierId} onChange={updateProduct}
                            placeholder="Supplier Id" />
                    </Form.Group>

                    <Button variant="primary" type="submit" style={{ marginTop: "1rem" }}>
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}


export default AddProducts