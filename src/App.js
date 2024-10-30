import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { InvoiceProvider } from './context/InvoiceContext';
import AppLayout from './components/AppLayout';
import InvoiceList from './components/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail';

const App = () => {
  return (
    <InvoiceProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
            <Route path="/" element={<Navigate to="/invoices" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </InvoiceProvider>
  );
};

export default App;