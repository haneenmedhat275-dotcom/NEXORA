export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 text-xs border-t" style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}>
      <span>&copy; 2024 NEXORA. Tactile Intelligence for the Modern Enterprise.</span>
      <div className="flex items-center gap-4">
        {['Privacy', 'Terms', 'API Status', 'LinkedIn'].map((link) => (
          <a key={link} href="#" className="transition-colors" style={{ color: '#9CA3AF' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1F2937'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
