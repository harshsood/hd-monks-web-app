import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Rocket,
  Building2,
  Shield,
  Palette,
  Globe,
  Users,
  FileText,
  CheckCircle,
  PenTool,
  Calculator,
  TrendingUp,
  Truck,
  Award,
  Gavel,
  BarChart,
  Search,
  DollarSign,
  Target,
  LineChart,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

import { testimonials } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingCalendar from '../components/BookingCalendar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast, Toaster } from 'sonner';

/* ===========================
   API CONFIG (FIXED)
=========================== */

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  console.error('❌ REACT_APP_API_BASE_URL is not defined');
}

const API = `${API_BASE}/api`;

/* ===========================
   ICON MAP
=========================== */

const iconMap = {
  Rocket,
  Building2,
  Shield,
  Palette,
  Globe,
  Users,
  FileText,
  CheckCircle,
  PenTool,
  Calculator,
  TrendingUp,
  Truck,
  Award,
  Gavel,
  BarChart,
  Search,
  DollarSign,
  Target,
  LineChart
};

/* ===========================
   COMPONENT
=========================== */

const Home = () => {
  const [businessType, setBusinessType] = useState('startup');
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/stages`);
      if (response.data?.success) {
        setStages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStages = stages.map(stage => ({
    ...stage,
    services: stage.services.filter(service =>
      service.relevant_for.includes(businessType)
    )
  }));

  const progressPercentage = businessType === 'startup' ? 20 : 75;

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      business_type: formData.get('business_type'),
      message: formData.get('message')
    };

    try {
      const response = await axios.post(`${API}/contact`, data);
      if (response.data?.success) {
        toast.success('Thank you! We will get back to you soon.');
        e.target.reset();
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" richColors />

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-gray-50 opacity-70"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-orange-100 text-orange-700">
            Your Business Growth Partner
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            From Idea to IPO,
            <span className="text-orange-500"> We've Got You Covered</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            End-to-end business solutions for startups and MSMEs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() =>
                document
                  .getElementById('services')
                  .scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsBookingOpen(true)}
            >
              Book Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {filteredStages.map((stage, index) => (
            <Card key={stage.id} className="mb-8 p-6 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold mb-2">{stage.title}</h3>
              <p className="text-gray-600 mb-4">{stage.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stage.services.map(service => {
                  const Icon = iconMap[service.icon];
                  return (
                    <div
                      key={service.id}
                      onClick={() => navigate(`/service/${service.service_id}`)}
                      className="p-4 bg-gray-50 hover:bg-orange-50 cursor-pointer rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-orange-500" />
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 bg-white text-gray-900">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <input name="full_name" placeholder="Full Name" required />
              <input name="email" type="email" placeholder="Email" required />
              <input name="phone" placeholder="Phone" required />
              <textarea name="message" placeholder="Message" required />
              <Button type="submit" className="bg-orange-500 w-full">
                Submit
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
      <BookingCalendar isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

export default Home;
