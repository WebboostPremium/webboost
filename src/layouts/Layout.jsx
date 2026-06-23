import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="contenido-principal" className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
