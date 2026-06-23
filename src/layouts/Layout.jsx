import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main id="contenido-principal" className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
