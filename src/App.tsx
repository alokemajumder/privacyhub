import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            theme="dark"
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy-policy-analyzer/:brandName/:id" element={<AnalysisPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;