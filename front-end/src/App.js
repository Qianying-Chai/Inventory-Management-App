import react from 'react'
import './App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar"
import { ProductProvider, UpdateProductContextProvider,SupplierInfoContextProvider } from './ProductContext'
import ProductsTable from './ProductsTable';
// import AddProducts from './components/addProducts';
import AddProducts from './components/AddProducts';
import UpdateProducts from './components/UpdateProducts';
import SupplierPage from './components/SupplierPage';
import AddSupplier from './components/AddSupplier';


function App() {
  return (
    <div className="App">
      <ProductProvider>

        <Router>
          <NavBar />
          <div className="row justify-content-center" >
            <div className="col-sm-11 col-xm-12 mr-auto ml-auto mt-4 mb-4">
            <UpdateProductContextProvider>
            <SupplierInfoContextProvider>
              <Routes>
                <Route path="/" element={<ProductsTable />} />
                <Route path="/addproduct" element={<AddProducts />} />
                <Route path="/updateproduct" element={<UpdateProducts/>} />
                <Route path="/supplierpage" element={<SupplierPage/>} />
                <Route path="/addsupplier/:product_id?" element={<AddSupplier/>} />
              </Routes>
              </SupplierInfoContextProvider>
              </UpdateProductContextProvider>
            </div>
          </div>
        </Router>
      </ProductProvider>
    </div>




  );
}

export default App;
