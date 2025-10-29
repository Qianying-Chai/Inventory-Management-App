import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import './Product.css';
import { SupplierContext } from '../ProductContext';
import { useNavigate, useParams } from 'react-router-dom';


const AddSupplier = () => {

    const { product_id } = useParams();
    const navigate = useNavigate()
    const { supplierInfo, setSupplierInfo } = useContext(SupplierContext)

    useEffect(() => {
        setSupplierInfo({
            emailTitle: '',
            emailContent: '',
            name: '',
            email: '',
            phone: '',
            company: '',
            id: ''
        })

    }, [])

    const handleSupplier = (e) => {
        setSupplierInfo({ ...supplierInfo, [e.target.name]: e.target.value })


    }

    const handleSupplierSubmit = async (e) => {
        e.preventDefault()

        if (!supplierInfo.name || supplierInfo.name.trim() === '') {
            alert("Supplier Name is required!");
            return;
        }

        if (!supplierInfo.email || supplierInfo.email.trim() === '') {
            alert("Email is required!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(supplierInfo.email)) {
            alert("Please enter a valid email address!");
            return;
        }

        if (!supplierInfo.phone || supplierInfo.phone.trim() === '') {
            alert("Phone Number is required!");
            return;
        }


        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(supplierInfo.phone.replace(/[\s-()]/g, ''))) {
            alert("Please enter a valid phone number!");
            return;
        }


        if (!supplierInfo.company || supplierInfo.company.trim() === '') {
            alert("Company is required!");
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/supplier', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    name: supplierInfo.name,
                    email: supplierInfo.email,
                    phone: supplierInfo.phone,
                    company: supplierInfo.company
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const resp = await response.json()
            if (resp.status === 'ok') {
                const newSupplierId = resp.data.id;

                if (product_id) {
                    const updateResponse = await fetch(
                        `http://localhost:8000/product/${product_id}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                supplier_id: newSupplierId
                            })
                        }
                    );

                }


                alert("Supplier Added");
                setSupplierInfo({
                    emailTitle: '',
                    emailContent: '',
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    id: ''
                })

                navigate("/")

            } else {
                alert("Failed to add supplier" + resp.message)
            }
        } catch (error) {
            alert("Error adding product: " + error.message)

        }


    }






    return (
        <Card>
            <Card.Body>
                <Form>
                    <Form.Group controlId='name' className="form-group">
                        <Form.Label className="form-label">Name</Form.Label>
                        <Form.Control
                            type='text'
                            name='name'
                            placeholder='supplier&#39;s Name'
                            value={supplierInfo.name || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>

                    <Form.Group controlId='email' className="form-group">
                        <Form.Label className="form-label">Email</Form.Label>
                        <Form.Control
                            type='email'
                            name='email'
                            placeholder='Email Address'
                            value={supplierInfo.email || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>

                    <Form.Group controlId='phone' className="form-group">
                        <Form.Label className="form-label">Phone Number</Form.Label>
                        <Form.Control
                            type='number'
                            name='phone'
                            placeholder='Phone'
                            value={supplierInfo.phone || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>

                    <Form.Group controlId='company' className="form-group">
                        <Form.Label className="form-label">Company</Form.Label>
                        <Form.Control
                            type='text'
                            name='company'
                            placeholder='Company'
                            value={supplierInfo.company || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>

                    <Form.Group controlId='emailTitle' className="form-group">
                        <Form.Label className="form-label">Email Title</Form.Label>
                        <Form.Control
                            type='Text'
                            name='emailTitle'
                            placeholder="Enter the title of your email"
                            value={supplierInfo.emailTitle || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>

                    <Form.Group controlId='email_msg' className="form-group">
                        <Form.Label className="form-label">Email Content</Form.Label>
                        <Form.Control
                            type='textfield'
                            name='emailContent'
                            placeholder="Enter the content of your email"
                            value={supplierInfo.emailContent || ''}
                            onChange={handleSupplier}
                        />
                    </Form.Group>
                    <Button className='btn btn-outline-primary m-1 button-text-color' variant='primary' onClick={handleSupplierSubmit}>
                        Add Supplier
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );

}
export default AddSupplier;