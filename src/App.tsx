import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  Header,
  Hero,
  Services,
  Industries,
  WhyChooseUs,
  CaseStudies,
  Teams,
  TechStack,
  Approach,
  ServiceDetails,
  Prescription,
  Testimonials,
  Contact,
  Footer,
  CustomCursor,
  ProtectedRoute,
} from './components';

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Industries />
        <WhyChooseUs />
        <CaseStudies />
        <Teams />
        <TechStack />
        <Approach />
        <ServiceDetails />
        <Prescription />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-slate-900 text-white overflow-x-hidden lg:cursor-none">
          <CustomCursor />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="ROLE_USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ROLE_ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
