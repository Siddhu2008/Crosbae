// src/contexts/CertificateContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api"; // ✅ unified API instance

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [state, setState] = useState({ certificates: [], loading: true, error: null });

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get("/v1/inventory/certifications/");
        setState({ certificates: res.data.results || res.data, loading: false, error: null });
      } catch (err) {
        setState({ certificates: [], loading: false, error: err.message });
      }
    };
    fetchCertificates();
  }, []);

  return (
    <CertificateContext.Provider value={{ state }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => useContext(CertificateContext);

export default CertificateContext;
