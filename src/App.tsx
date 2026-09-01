import { useState, type KeyboardEvent } from 'react'
import { Search, Sparkles, Command, ArrowRight, CornerDownLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const suggestions = ['Documentation', 'Components', 'Settings', 'Analytics', 'Integrations']

export default function App() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const handleSearch = () => {
    if (query.trim()) {
      setSubmittedQuery(query.trim())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Top pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-zinc-200">Profind Instant Search</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">Bun + React</span>
        </div>

        {/* Header Title */}
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            search here only
          </span>
        </h1>
        <p className="mb-8 max-w-md text-sm text-zinc-400 sm:text-base">
          Lightning-fast discovery powered by Vite, Tailwind CSS &amp; Shadcn UI.
        </p>

        {/* Search Bar Container */}
        <div className="w-full">
          <div className="group relative flex items-center">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-zinc-500 transition-colors group-focus-within:text-indigo-400" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="search here only..."
              className="h-14 pl-12 pr-28 text-base shadow-2xl transition-all focus-visible:ring-indigo-500/40"
              autoFocus
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-9 gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-white shadow hover:bg-indigo-500"
              >
                <span>Search</span>
                <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </div>
          </div>

          {/* Quick Suggestions & Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-500">Try:</span>
              {suggestions.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  onClick={() => {
                    setQuery(item)
                    setSubmittedQuery(item)
                  }}
                  className="cursor-pointer border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  {item}
                </Badge>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1 text-zinc-500">
              <Command className="h-3 w-3" />
              <span>Press Enter to search</span>
            </div>
          </div>
        </div>

        {/* Search Result Display */}
        {submittedQuery && (
          <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-left backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Search Query</span>
                <span className="text-xs text-emerald-400">Active</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                  <span className="font-mono text-zinc-200">"{submittedQuery}"</span>
                </div>
                <span className="text-xs text-zinc-500">Searched exclusively here</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

