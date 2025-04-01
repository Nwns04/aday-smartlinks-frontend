import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-lg">Aday Smartlinks</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
