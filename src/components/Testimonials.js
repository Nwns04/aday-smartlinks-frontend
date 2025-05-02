import React, { useState, useEffect } from "react";
import API from "../services/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch testimonials from backend (you'll need to create a route for this)
    const fetchTestimonials = async () => {
      try {
        const res = await API.get("/testimonials");
        setTestimonials(res.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 my-4">
      <h3 className="text-xl font-bold mb-3">Success Stories</h3>
      {testimonials.length === 0 ? (
        <p className="text-gray-600">No testimonials yet.</p>
      ) : (
        testimonials.map((t, idx) => (
          <div key={idx} className="mb-3 border-b pb-2">
            <p className="text-sm italic">"{t.message}"</p>
            <p className="text-xs text-gray-500">- {t.artistName}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Testimonials;
