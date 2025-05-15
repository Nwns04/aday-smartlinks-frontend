// src/components/PublicLink/PublicFooter.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* … your big marketing footer markup … */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          © {new Date().getFullYear()} Aday Smartlinks. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
