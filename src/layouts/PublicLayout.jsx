// src/layouts/PublicLayout.jsx
import React from 'react'
import PublicFooter from '../components/PublicLink/PublicFooter'

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* optional: you can omit PublicNavbar if you truly want no header */}
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </div>
  )
}
