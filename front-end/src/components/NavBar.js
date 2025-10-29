import React, { useContext, useState } from "react"
import { Navbar, Form, FormControl, Button, Badge, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ProductContext } from "../ProductContext"


const NavBar = () => {
  const { products, setDisplayedProducts } = useContext(ProductContext);

  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const fileteredPoducts = (e) => {
    e.preventDefault()
    const searchedProducts = products.data.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    setDisplayedProducts({ "data": [...searchedProducts] })


  }


  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container fluid className="px-3">
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="me-3">
            Inventory Management App
          </Navbar.Brand>
          <Badge bg="primary" className="mt-1">
            In stock: {products?.data?.length || 0}
          </Badge>
        </div>
        <Form className="d-flex align-items-center" onSubmit={fileteredPoducts}>
          <Link to="/addproduct" className="btn btn-primary btn-sm me-3">
            Add Product
          </Link>
          <FormControl
            type="text"
            placeholder="Search"
            className="me-2"
            style={{ width: "180px" }}
            value={search}
            onChange={handleSearch}
          />
          <Button type="submit" variant="outline-primary"  >
            Search
          </Button>
        </Form>
      </Container>
    </Navbar>
  );
};

export default NavBar;
