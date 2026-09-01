import { useState, type KeyboardEvent } from 'react'
import { Search, Sparkles, Command, ArrowRight, CornerDownLeft, Loader2, Bot, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const suggestions = ['What is artificial intelligence?', 'Explain quantum computing in simple terms', 'How do neural networks work?', 'Best practices for React + Vite with Bun']

export default function App() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [modelInfo, setModelInfo] = useState<{ provider?: string; model?: string }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (overrideQuery?: string) => {
    const textToSearch = (overrideQuery ?? query).trim()
    if (!textToSearch || loading) return

    setSubmittedQuery(textToSearch)
    setAnswer('')
    setModelInfo({})
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSearch }),
      })

      const contentType = response.headers.get('content-type') || ''
      let data: any = {}

      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        if (!response.ok) {
          throw new Error(text || `Server returned error (${response.status})`)
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `Server error (${response.status})`)
      }

      setAnswer(data.answer || 'No response generated.')
      setModelInfo({ provider: data.provider, model: data.model })
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to backend server. Make sure `bun run dev` is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Top pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-medium text-zinc-200">Groq &amp; OpenAI Ready</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">Bun Backend</span>
        </div>

        {/* Header Title */}
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            search here only
          </span>
        </h1>
        <p className="mb-8 max-w-md text-sm text-zinc-400 sm:text-base">
          Ask any question directly to your secure OpenAI-powered backend.
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
              disabled={loading}
              className="h-14 pl-12 pr-28 text-base shadow-2xl transition-all focus-visible:ring-indigo-500/40 disabled:opacity-70"
              autoFocus
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <Button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                size="sm"
                className="h-9 gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-white shadow hover:bg-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Thinking</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />
                  </>
                )}
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
                    handleSearch(item)
                  }}
                  className="cursor-pointer border-zinc-800 bg-zinc-900/50 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 text-left truncate max-w-[200px] sm:max-w-none"
                >
                  {item}
                </Badge>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-1 text-zinc-500">
              <Command className="h-3 w-3" />
              <span>Press Enter</span>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 text-sm text-zinc-400 backdrop-blur-md animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Consulting AI response...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-3 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-left backdrop-blur-md">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-red-200">Backend Error</p>
                <p className="text-red-300/80 mt-1">{error}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  Make sure your backend server is running (<code className="text-zinc-300">bun run server</code>) and <code className="text-zinc-300">OPENAI_API_KEY</code> is set in <code className="text-zinc-300">.env</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Result Display */}
        {submittedQuery && !loading && !error && answer && (
          <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-left backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">AI Search Result</span>
                </div>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                  {modelInfo.provider ? `${modelInfo.provider} (${modelInfo.model})` : 'Secure Server Response'}
                </span>
              </div>
              <div className="mt-3 text-xs text-zinc-400 flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span className="font-mono text-zinc-300">Query: "{submittedQuery}"</span>
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/50">
                {answer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

