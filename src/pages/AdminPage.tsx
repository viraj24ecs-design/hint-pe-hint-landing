import React from "react";
import { Link } from "react-router-dom";

const AdminPage: React.FC = () => {
  return (
    <>
   {/* Navbar fixed*/}
   <nav className="fixedtop-0 left-0 right-0 bg-white shadow-md z-50 h-16">
    <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Link to="/" className="infline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-blue-100 transition">
            A
            </Link>
            <span className="text-lg font-semibold text-gray-900">Bookify</span>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/admin" className="text-sm font-medium text-gray-700">Admin Dashboard</Link>

            </div></div>
    </nav>
    <main className="min-h-screen bg-white flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-9">Admin page</h1>5                                                                                                                                                          
    </main>
    </>
  );
};
export default AdminPage;
