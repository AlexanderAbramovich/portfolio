import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import ScrollRestore from './hooks/useScrollRestore'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Works from './pages/Works/Works'
import Case from './pages/Case/Case'
import About from './pages/About/About'
import Services from './pages/Services/Services'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'

function App() {
  return (
    <LanguageProvider>
      <Header />
      <ScrollRestore />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:id" element={<Case />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </LanguageProvider>
  )
}

export default App
