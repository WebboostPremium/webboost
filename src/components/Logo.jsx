import { Link } from 'react-router-dom'
import { SITE } from '../config/site'

const styles = {
  nav: 'h-10 sm:h-11 w-auto max-w-[160px] object-contain object-left',
  footer: 'h-24 sm:h-28 w-auto object-contain object-left',
  full: 'h-auto w-full max-w-[200px] object-contain',
}

export default function Logo({ variant = 'nav', className = '' }) {
  return (
    <Link to="/" className={`inline-flex shrink-0 ${className}`} aria-label={`${SITE.name} — ${SITE.tagline}`}>
      <img
        src={SITE.logo}
        alt={SITE.logoAlt}
        className={styles[variant] ?? styles.nav}
        width={variant === 'footer' ? 200 : 136}
        height={variant === 'footer' ? 96 : 44}
        decoding="async"
        fetchPriority={variant === 'nav' ? 'high' : 'auto'}
      />
    </Link>
  )
}
