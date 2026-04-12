import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 bg-[#020617]" />
      <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content Layer */}
      <main className="relative z-10">
        <Dashboard />
      </main>
      
      {/* Branding Overlay */}
      <div className="fixed bottom-4 left-4 z-20">
        <div className="glass-panel px-3 py-1 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] text-muted font-bold tracking-widest uppercase">System Online</span>
        </div>
      </div>
    </div>
  )
}

export default App
