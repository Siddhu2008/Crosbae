// src/contexts/CertificateContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [state, setState] = useState({ certificates: [] });

  useEffect(() => {
    // fetch certificates from API
    const fetchCertificates = async () => {
      try {
        const res = await api.get("/v1/inventory/certifications/");
        const data = res.data;
        setState({ certificates: data.results || data });
      } catch (err) {
        console.error("Failed to fetch certificates", err);
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
