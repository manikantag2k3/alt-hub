// src/context/InvoiceContext.js
import React, { createContext, useState, useContext } from 'react';

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([
    {
      id: '1',
      date: '2024-10-30',
      invoiceNumber: 1001,
      customerName: 'John Doe',
      billingAddress: '123 Main St, City',
      shippingAddress: '123 Main St, City',
      gstin: 'GST123456',
      items: [
        { id: '1', itemName: 'Item 1', quantity: 2, price: 100, amount: 200 }
      ],
      billSundrys: [
        { id: '1', billSundryName: 'Shipping', amount: '50' }
      ],
      totalAmount: 250
    }
  ]);

  const addInvoice = (invoice) => {
   
    const newId = (Math.max(...invoices.map(inv => parseInt(inv.id)), 0) + 1).toString();
    const newInvoiceNumber = Math.max(...invoices.map(inv => inv.invoiceNumber), 1000) + 1;
    
    const newInvoice = {
      ...invoice,
      id: newId,
      invoiceNumber: newInvoiceNumber
    };
    
    setInvoices([...invoices, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (updatedInvoice) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const getInvoice = (id) => {
    return invoices.find(invoice => invoice.id === id) || null;
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoice
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);