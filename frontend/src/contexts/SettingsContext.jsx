import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    company_name: 'HD MONKS',
    site_title: 'HD MONKS - Business Solutions',
    site_description: 'End-to-end business solutions from startup to IPO',
    company_logo_url: 'https://customer-assets.emergentagent.com/job_bizlaunch-guide-1/artifacts/7w27dsce_HD%20Monks%20%282%29.png',
    favicon_url: '',
    company_email: 'contact@hdmonks.com',
    company_phone: '+91 XXX XXX XXXX',
    company_address: '',
    social_links: { linkedin: '', twitter: '', facebook: '' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      if (response.data.success && response.data.data) {
        setSettings(prev => ({...prev, ...response.data.data}));
        // Update page title and description
        document.title = response.data.data.site_title || 'HD MONKS';
        document.querySelector('meta[name="description"]')?.setAttribute(
          'content',
          response.data.data.site_description || 'Business Solutions'
        );
        // Update favicon
        if (response.data.data.favicon_url) {
          const link = document.querySelector('link[rel="icon"]') || document.createElement('link');
          link.rel = 'icon';
          link.href = response.data.data.favicon_url;
          document.head.appendChild(link);
        }
      }
    } catch (error) {
      console.log('Settings not available yet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
