import React, { useState, createContext,useEffect} from 'react'
export const ProductContext = createContext();

export const ProductProvider = ({children}) => {

    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : { 'data': [] };
    });
    const [displayedProducts, setDisplayedProducts] = useState({ 'data': [] });
  
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);
    return (
        <ProductContext.Provider value={{
            products,
            setProducts,
            displayedProducts,
            setDisplayedProducts
        }}>
           {children}
        </ProductContext.Provider>
    )
}

export const UpdateProductContext = createContext();



export const UpdateProductContextProvider = ({children}) => {



    const [updateProductInfo, setUpdateProductInfo] = useState(() => {
        const saved = localStorage.getItem('updateProductInfo');
        return saved ? JSON.parse(saved) : {
            ProductName: "",
            QuantityInStock: 0,
            QuantitySold: 0,
            UnitPrice: 0,
            Revenue: 0,
            ProductId: "",
            SupplierId: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('updateProductInfo', JSON.stringify(updateProductInfo));
    }, [updateProductInfo]);

    return (
        <UpdateProductContext.Provider value={{updateProductInfo, setUpdateProductInfo}}>
            {children}
        </UpdateProductContext.Provider>
    )
}

export const SupplierContext = createContext();


export const SupplierInfoContextProvider = ({children}) => {

  
    const [supplierInfo, setSupplierInfo] = useState(() => {
        const saved = localStorage.getItem('supplierInfo');
        return saved ? JSON.parse(saved) : {
            name: "",
            email: '',
            phone: '',
            company: '',
            id: "",
            emailTitle: '',
            emailContent: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('supplierInfo', JSON.stringify(supplierInfo));
    }, [supplierInfo]);


    return (
        <SupplierContext.Provider value={{supplierInfo, setSupplierInfo}}>
            {children}
        </SupplierContext.Provider>
    )
}