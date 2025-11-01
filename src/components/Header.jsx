import { Brain, LayoutDashboard, Upload, Network, CreditCard, Settings } from 'lucide-react'

const Header = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Add Material', icon: Upload },
    { id: 'graph', label: 'Knowledge Mesh', icon: Network },
    { id: 'flashcards', label: 'Flashcards', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <header className="bg-primary text-text-light shadow-soft-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="bg-accent rounded-xl p-2">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MindMesh</h1>
              <p className="text-xs text-accent">AI Study Assistant</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeView === item.id
                      ? 'bg-accent text-white shadow-glow'
                      : 'text-text-light hover:bg-secondary-light'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-secondary-light">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeView === item.id
                    ? 'bg-accent text-white shadow-glow'
                    : 'text-text-light hover:bg-secondary-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header
