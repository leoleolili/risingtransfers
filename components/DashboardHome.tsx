"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  BarChart3,
  Github,
  Instagram,
  Star,
  User,
  Bell,
  Check,
  Clock,
  Command,
  Compass,
  CreditCard,
  Globe,
  Hexagon,
  LineChart,
  type LucideIcon,
  MapPin,
  MessageSquare,
  Mic,
  Moon,
  Mountain,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sun,
  Terminal,
  Waves,
  Wifi,
  Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ChatInput from "@/components/chat-input"

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: { icon: LucideIcon; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start ${active ? "bg-slate-800/10 text-cyan-500 font-semibold" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColor = () => {
    switch (color) {
      case "amber":
        return "from-amber-500 to-red-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-amber-500 to-red-500"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${getColor()} rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
  detail,
  isDecimal = false,
}: {
  title: string
  value: number
  icon: LucideIcon
  trend: "up" | "down" | "stable"
  color: string
  detail: string
  isDecimal?: boolean
}) {
  const getColor = () => {
    switch (color) {
      case "amber":
        return "from-amber-500 to-red-500 border-amber-500/30"
      case "green":
        return "from-green-500 to-emerald-500 border-green-500/30"
      case "blue":
        return "from-blue-500 to-indigo-500 border-blue-500/30"
      case "purple":
        return "from-purple-500 to-pink-500 border-purple-500/30"
      default:
        return "from-amber-500 to-red-500 border-amber-500/30"
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <BarChart3 className="h-4 w-4 text-amber-500" />
      case "down":
        return <BarChart3 className="h-4 w-4 rotate-180 text-green-500" />
      case "stable":
        return <LineChart className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-6 h-64 flex flex-col justify-between relative overflow-hidden transition-all hover:scale-105 hover:bg-slate-800/70 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">{title}</div>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold mb-1 bg-gradient-to-r bg-clip-text text-transparent from-slate-100 to-slate-300">
        {isDecimal ? value.toFixed(1) : value}
      </div>
      <div className="text-xs text-slate-500">{detail}</div>
      <div className="absolute bottom-2 right-2 flex items-center">{getTrendIcon()}</div>
      <div className="absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-amber-500 to-red-500"></div>
    </div>
  )
}

// Performance chart component
function PerformanceChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">100%</div>
        <div className="text-xs text-slate-500">75%</div>
        <div className="text-xs text-slate-500">50%</div>
        <div className="text-xs text-slate-500">25%</div>
        <div className="text-xs text-slate-500">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const cpuHeight = Math.floor(Math.random() * 60) + 20
          const memHeight = Math.floor(Math.random() * 40) + 40
          const netHeight = Math.floor(Math.random() * 30) + 30

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${cpuHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${memHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${netHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">00:00</div>
        <div className="text-xs text-slate-500">06:00</div>
        <div className="text-xs text-slate-500">12:00</div>
        <div className="text-xs text-slate-500">18:00</div>
        <div className="text-xs text-slate-500">24:00</div>
      </div>
    </div>
  )
}

// TransferRow component (replaces EarthquakeRow)
function TransferRow({
  id,
  magnitude, // Used for probability
  depth, // Used for confidence score
  location, // Used for Player Name / Club
  time,
  felt, // Used for "Confirmed" status
}: {
  id: string
  magnitude: number
  depth: number
  location: string
  time: Date
  felt: boolean
}) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "text-green-400"
    if (prob >= 60) return "text-amber-400"
    if (prob >= 40) return "text-yellow-400"
    return "text-red-400"
  }

  // Parse location string to split player/club mock
  // format: "Player Name (Club)"
  const displayTitle = location

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">#{id.slice(-4)}</div>
      <div className={`col-span-2 font-medium ${getProbabilityColor(magnitude * 20)}`}>{(magnitude * 20).toFixed(0)}%</div>
      <div className="col-span-4 text-slate-200 font-medium truncate pr-2">{displayTitle}</div>
      <div className="col-span-2 text-purple-400">{depth}k <span className="text-xs text-slate-500">RT Pts</span></div>
      <div className="col-span-2 text-slate-400">{time ? formatTime(time) : "--:--"}</div>
      <div className="col-span-1">
        <Badge
          variant="outline"
          className={`${felt
            ? "bg-green-500/10 text-green-400 border-green-500/30"
            : "bg-slate-500/10 text-slate-400 border-slate-500/30"
            } text-xs`}
        >
          {felt ? "HERE WE GO" : "RUMOR"}
        </Badge>
      </div>
    </div>
  )
}

// GlobalMap component (Renamed from EarthquakeMap)
function GlobalMap({ earthquakes }: { earthquakes: any[] }) {

  useEffect(() => {
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw map background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw coastlines (simplified)
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3)
    ctx.lineTo(canvas.width * 0.2, canvas.height * 0.4)
    ctx.lineTo(canvas.width * 0.3, canvas.height * 0.35)
    ctx.lineTo(canvas.width * 0.4, canvas.height * 0.5)
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.45)
    ctx.lineTo(canvas.width * 0.6, canvas.height * 0.6)
    ctx.lineTo(canvas.width * 0.7, canvas.height * 0.55)
    ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7)
    ctx.stroke()

    // Draw Hotspots (formerly earthquakes)
    earthquakes.forEach((eq) => {
      // Convert lat/long to canvas coordinates (simplified mapping)
      const x = ((eq.location[1] + 10) / 70) * canvas.width
      const y = ((eq.location[0] + 40) / 70) * canvas.height

      // Size based on magnitude (probability)
      const size = eq.magnitude * 2

      // Color based on active status
      const depthColor = eq.depth < 30 ? "#f59e0b" : eq.depth < 70 ? "#8b5cf6" : "#22d3ee"

      // Draw hotspot circle
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = depthColor
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Active radar ping effect
      if (new Date().getTime() - eq.timestamp.getTime() < 86400000) {
        ctx.beginPath()
        ctx.arc(x, y, size + 5, 0, Math.PI * 2)
        ctx.strokeStyle = `${depthColor}80`
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, size + 15, 0, Math.PI * 2)
        ctx.strokeStyle = `${depthColor}40`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    })

    // Draw legend
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(10, 10, 140, 80)
    ctx.strokeStyle = "#334155"
    ctx.strokeRect(10, 10, 140, 80)

    ctx.fillStyle = "#f8fafc"
    ctx.font = "10px sans-serif"
    ctx.fillText("Transfer Activity", 15, 25)

    // Legend items
    const legendItems = [{ color: "#22d3ee", label: "Confirmed" }, { color: "#8b5cf6", label: "Advanced" }, { color: "#f59e0b", label: "Rumor" }]
    legendItems.forEach((item, i) => {
      const y = 40 + i * 15
      ctx.beginPath()
      ctx.arc(20, y - 3, 4, 0, Math.PI * 2)
      ctx.fillStyle = item.color
      ctx.fill()

      ctx.fillStyle = "#94a3b8"
      ctx.fillText(item.label, 30, y)
    })

    // Handle window resize
    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Redraw everything
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [earthquakes])

}



export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  // Ensure we have a defined theme for initial render to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)

  // Simulation states
  const [activeStations, setActiveStations] = useState(124)
  const [networkStatus, setNetworkStatus] = useState(98)
  const [alertLevel, setAlertLevel] = useState(2)
  const [monitoringStatus, setMonitoringStatus] = useState(85)
  const [recentMagnitude, setRecentMagnitude] = useState(4.2)
  const [earthquakeDepth, setEarthquakeDepth] = useState(68)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [earthquakes, setEarthquakes] = useState<any[]>([]) // Using same state name for minimal refactor


  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])


  // Update time
  useEffect(() => {
    setCurrentTime(new Date())
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentMagnitude(Number.parseFloat((Math.random() * 3 + 2.5).toFixed(1)))
      setEarthquakeDepth(Math.floor(Math.random() * 50) + 10)
      setNetworkStatus(Math.floor(Math.random() * 15) + 80)
      setMonitoringStatus(Math.floor(Math.random() * 10) + 80)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simulate fetching Transfer Data (Mocking Earthquake API structure)
  useEffect(() => {
    // Generate mock transfer data instead of fetching earthquakes
    const generateMockTransfers = () => {
      const mockPlayers = ["Mbappe (Real Madrid)", "Osimhen (Chelsea)", "Davies (Real Madrid)", "Salah (Al Ittihad)", "Kimmich (Barca)", "Bruno G. (PSG)", "Isak (Arsenal)"]
      const mockRegions = ["Madrid, Spain", "London, UK", "Munich, Germany", "Paris, France", "Jeddah, SA", "Barcelona, Spain", "Newcastle, UK"]

      return Array.from({ length: 8 }, (_, i) => ({
        id: `tr-${Date.now()}-${i}`,
        magnitude: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0 (mapped to 60% - 100%)
        depth: Math.floor(Math.random() * 10000) + 500, // Mapped to RT Points
        location: [
          Number.parseFloat((Math.random() * 60 - 30).toFixed(2)),
          Number.parseFloat((Math.random() * 60 + 10).toFixed(2)),
        ],
        region: mockPlayers[i % mockPlayers.length], // Overriding region with Player Name
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
        felt: Math.random() > 0.7, // Overriding 'felt' with 'Confirmed' status
      }))
    }

    setEarthquakes(generateMockTransfers())

    const interval = setInterval(() => {
      setEarthquakes(prev => {
        // Keep the list fresh
        const newTransfer = generateMockTransfers()[0];
        return [newTransfer, ...prev.slice(0, 7)]
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date | null) => {
    if (!date) return "--:--"
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "-- / -- / ----"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Navigate to other pages
  const navigateTo = (path: string) => {
    router.push(path)
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === "dark" ? "bg-black text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-amber-500 font-mono text-sm animate-pulse">LOADING RT...</div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="min-h-screen flex flex-col p-4 md:p-6 transition-all duration-500">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex flex-col -space-y-1">
            <span className="text-xl md:text-2xl font-semibold tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text font-[family-name:var(--font-inter)]">
              RISING TRANSFERS<span className="text-[0.3em] align-top ml-0.5 opacity-80">®</span>
            </span>
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500/80 tracking-[0.25em] pl-1 font-[family-name:var(--font-inter)]">
              SEE IT RISING
            </span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center text-sm font-medium text-slate-400 dark:text-slate-500 cursor-pointer hover:text-cyan-400 dark:hover:text-cyan-400 transition-all duration-200 hover:scale-110 active:scale-90 select-none">
              <span className="font-[family-name:var(--font-bungee-spice)] font-semibold text-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text opacity-90">SUBSCRIBE</span>
            </div>
            <div className="hidden md:flex items-center text-sm font-medium text-slate-400 dark:text-slate-500 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 select-none">
              <Settings className="h-4 w-4" />
            </div>



            <div className="flex items-center space-x-3">

              <div className="flex items-center rounded-full border p-1 transition-colors duration-300 bg-white border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("dark")}
                  className={`h-7 w-7 rounded-full transition-all ${theme === "dark" ? "bg-slate-700 text-cyan-400" : "text-slate-400 hover:text-cyan-500"}`}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("light")}
                  className={`h-7 w-7 rounded-full transition-all ${theme === "light" ? "bg-slate-200 text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                >
                  <Sun className="h-4 w-4" />
                </Button>
              </div>

              <Avatar className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { }}>
                <AvatarImage src="/user_avatar.png" alt="User" className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-cyan-500/80">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Center Content - Reconstructed */}
          <div className="col-span-12">
            {/* Hero Chat Section */}
            <div className="w-full max-w-4xl mx-auto py-8 md:py-10 flex flex-col items-center text-center space-y-6 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-[family-name:var(--font-iceland)]">RT Assistant</span>
              </h2>

              <div className="w-full max-w-2xl">
                <ChatInput />
              </div>
            </div>

            {/* 3x3 Metric Grid */}
            {/* 3x3 Metric Grid (Reduced to 6) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both" style={{ animationDelay: '0.2s' }}>
              {/* Custom Image Card */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/endrick_final.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-1 shadow-black drop-shadow-md">Endrick to Lyon</h3>
                </div>
              </div>
              {/* Custom Black Card - Semenyo */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 flex flex-col justify-end cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/semenyo.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold text-white mb-1">Semenyo to Man City</h3>
              </div>
              {/* Custom Black Card - Sigur */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 flex flex-col justify-end cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/sigur.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold text-white mb-1">Sigur to Wolves</h3>
              </div>

              {/* Custom Black Card - Kaiki */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 flex flex-col justify-end cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/kaiki.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold text-white mb-1">Kaiki to Como</h3>
              </div>
              {/* Custom Black Card - Samardzić */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 flex flex-col justify-end cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/lazar.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold text-white mb-1">Samardzić Transfer</h3>
              </div>
              {/* Custom Black Card - Álvaro Fernandez */}
              <div
                onClick={() => { }}
                className="relative group overflow-hidden rounded-lg border border-slate-800 bg-black p-6 h-64 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 ring-1 ring-cyan-500/20 flex flex-col justify-end cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-opacity group-hover:opacity-60"
                  style={{ backgroundImage: 'url("/fernandez.jpg")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <h3 className="relative z-10 text-2xl font-bold text-white mb-1">Álvaro Fernandez to Deportivo La Coruña</h3>
              </div>
            </div>
            {/* Footer */}
            {/* Footer */}
            <footer className="mt-32 pt-16 pb-8 border-t border-slate-200/60 dark:border-slate-800/50 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-slate-400 text-sm -mx-4 md:-mx-6 px-4 md:px-6">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Branding */}
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl md:text-2xl font-semibold tracking-wider bg-gradient-to-r from-cyan-500 to-purple-600 dark:from-cyan-400 dark:to-purple-500 text-transparent bg-clip-text font-[family-name:var(--font-inter)]">
                    RISING TRANSFERS<span className="text-[0.3em] align-top ml-0.5 opacity-80">®</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400/80 dark:text-slate-500/60 tracking-[0.3em] pl-1 font-[family-name:var(--font-inter)]">
                    SEE IT RISING
                  </span>
                </div>

                {/* Instagram */}
                <div className="flex flex-col space-y-3">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-widest">Instagram</h4>
                  <a
                    href="https://www.instagram.com/leo.li10"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors duration-200 select-none group"
                  >
                    <Instagram className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                    <span className="font-medium">@leo.li10</span>
                  </a>
                </div>

                {/* X */}
                <div className="flex flex-col space-y-3">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-widest">X</h4>
                  <a
                    href="https://x.com/leooolili"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors duration-200 select-none group"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                    <span className="font-medium">@leooolili</span>
                  </a>
                </div>

                {/* GitHub */}
                <div className="flex flex-col space-y-3">
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-widest">Github</h4>
                  <a
                    href="https://github.com/leoleolili"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-700 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors duration-200 select-none group"
                  >
                    <Github className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                    <span className="font-medium">@leoleolili</span>
                  </a>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/50 text-center text-slate-500 dark:text-slate-500 text-xs font-medium">
                © 2025 Rising Transfers
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
