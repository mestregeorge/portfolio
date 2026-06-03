import { useEffect, useRef, useState } from 'react'

const navbarText = {
  en: {
    ariaLabel: 'Main navigation',
    toggleNavigation: 'Toggle navigation',
    languageAria: 'Select website language',
    about: 'More About Me',
    projects: 'View Projects',
    contact: 'Contact Me',
  },
  pt: {
    ariaLabel: 'Navegação principal',
    toggleNavigation: 'Abrir navegação',
    languageAria: 'Selecionar idioma do site',
    about: 'Mais Sobre Mim',
    projects: 'Ver Projetos',
    contact: 'Contacta-me',
  },
}

function Navbar({ locale, onLocaleChange }) {
  const text = navbarText[locale]
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.matchMedia('(min-width: 992px)').matches) {
        setIsMenuOpen(false)
      }
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', closeDesktopMenu)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('resize', closeDesktopMenu)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const closeOnOutsidePress = (event) => {
      const dropdown = dropdownRef.current
      const menuButton = menuButtonRef.current

      if (
        dropdown?.contains(event.target) ||
        menuButton?.contains(event.target)
      ) {
        return
      }

      setIsMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const handleAboutClick = (event) => {
    event.preventDefault()
    closeMenu()
    window.dispatchEvent(new Event('portfolio:scroll-about'))
  }

  const handleLocaleChange = (event) => {
    onLocaleChange(event.target.value)
  }

  const renderLanguageSelect = (className = '', tabIndex) => (
    <select
      className={`form-select border border-2 border-white bg-primary text-white fw-semibold navbar-language-select ${className}`}
      aria-label={text.languageAria}
      value={locale}
      onChange={handleLocaleChange}
      tabIndex={tabIndex}
    >
      <option value="en">🇬🇧 ENG</option>
      <option value="pt">🇵🇹 PT</option>
    </select>
  )

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary sticky-top portfolio-navbar"
      data-bs-theme="dark"
      aria-label={text.ariaLabel}
    >
      <div className="container">
        <a className="navbar-brand fw-bold text-white" href="#home">
          George Aguiar
        </a>
        <div className="navbar-mobile-actions d-lg-none">
          {renderLanguageSelect('mobile-navbar-language')}
          <button
            className="navbar-toggler border-white"
            ref={menuButtonRef}
            type="button"
            aria-controls="portfolioNavDropdown"
            aria-expanded={isMenuOpen}
            aria-label={text.toggleNavigation}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="navbar-collapse d-none d-lg-flex" id="portfolioNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 portfolio-navbar-nav">
            {renderLanguageSelect('me-lg-2 w-auto')}
            <a
              className="nav-link text-white fw-semibold"
              href="#about"
              onClick={handleAboutClick}
            >
              {text.about}
            </a>
            <a
              className="nav-link text-white fw-semibold"
              href="#projects"
              onClick={closeMenu}
            >
              {text.projects}
            </a>
            <a
              className="btn border border-2 border-white text-white fw-semibold ms-lg-2 navbar-contact-button"
              href="#contact"
              onClick={closeMenu}
            >
              {text.contact}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`mobile-nav-dropdown d-lg-none ${isMenuOpen ? 'is-open' : ''}`}
        id="portfolioNavDropdown"
        ref={dropdownRef}
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-nav-dropdown-inner">
          <a
            className="mobile-nav-link"
            href="#about"
            onClick={handleAboutClick}
            tabIndex={isMenuOpen ? undefined : -1}
          >
            {text.about}
          </a>
          <a
            className="mobile-nav-link"
            href="#projects"
            onClick={closeMenu}
            tabIndex={isMenuOpen ? undefined : -1}
          >
            {text.projects}
          </a>
          <a
            className="btn border border-2 border-white text-white fw-semibold mobile-nav-contact"
            href="#contact"
            onClick={closeMenu}
            tabIndex={isMenuOpen ? undefined : -1}
          >
            {text.contact}
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
