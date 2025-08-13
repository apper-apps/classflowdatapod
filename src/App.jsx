import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Students from "@/components/pages/Students";
import Classes from "@/components/pages/Classes";
import Attendance from "@/components/pages/Attendance";
import Grades from "@/components/pages/Grades";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
        <div className="lg:pl-64">
          <main className="flex-1">
            <div className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard onMenuToggle={handleMenuToggle} />} />
                <Route path="/students" element={<Students onMenuToggle={handleMenuToggle} />} />
                <Route path="/classes" element={<Classes onMenuToggle={handleMenuToggle} />} />
                <Route path="/attendance" element={<Attendance onMenuToggle={handleMenuToggle} />} />
                <Route path="/grades" element={<Grades onMenuToggle={handleMenuToggle} />} />
              </Routes>
            </div>
          </main>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;