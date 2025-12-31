"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Command,
  Globe,
  Hexagon,
  LineChart,
  type LucideIcon,
  MessageSquare,
  Mic,
  Moon,
  RefreshCw,
  Search,
  Settings,
  Sun,
  Terminal,
  Wifi,
} from "lucide-react"

import { MapPin, Waves, Mountain, Compass, Clock, AlertTriangle } from "lucide-react"

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
      className={`w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`}
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
    <div className={`bg-slate-800/50 rounded-lg border ${getColor()} p-4 relative overflow-hidden`}>
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

// EarthquakeRow component
function EarthquakeRow({
  id,
  magnitude,
  depth,
  location,
  time,
  felt,
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

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return "text-red-400"
    if (mag >= 5) return "text-amber-400"
    if (mag >= 4) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-1 text-slate-500">{id}</div>
      <div className={`col-span-2 font-medium ${getMagnitudeColor(magnitude)}`}>{magnitude.toFixed(1)}</div>
      <div className="col-span-2 text-purple-400">{depth} km</div>
      <div className="col-span-4 text-slate-300">{location}</div>
      <div className="col-span-2 text-slate-400">{formatTime(time)}</div>
      <div className="col-span-1">
        <Badge
          variant="outline"
          className={`${
            felt
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-slate-500/10 text-slate-400 border-slate-500/30"
          } text-xs`}
        >
          {felt ? "Hissedildi" : "Hissedilmedi"}
        </Badge>
      </div>
    </div>
  )
}

// EarthquakeMap component
function EarthquakeMap({ earthquakes }: { earthquakes: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
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

    // Draw earthquakes
    earthquakes.forEach((eq) => {
      // Convert lat/long to canvas coordinates (simplified mapping)
      const x = ((eq.location[1] + 10) / 70) * canvas.width
      const y = ((eq.location[0] + 40) / 70) * canvas.height

      // Size based on magnitude
      const size = eq.magnitude * 3

      // Color based on depth
      const depthColor = eq.depth < 30 ? "#f59e0b" : eq.depth < 70 ? "#8b5cf6" : "#3b82f6"

      // Draw earthquake circle
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = depthColor
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Draw ripple effect for recent earthquakes
      if (new Date().getTime() - eq.timestamp.getTime() < 86400000) {
        ctx.beginPath()
        ctx.arc(x, y, size + 5, 0, Math.PI * 2)
        ctx.strokeStyle = `${depthColor}80`
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, size + 10, 0, Math.PI * 2)
        ctx.strokeStyle = `${depthColor}40`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    })

    // Draw legend
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(10, 10, 120, 80)
    ctx.strokeStyle = "#334155"
    ctx.strokeRect(10, 10, 120, 80)

    ctx.fillStyle = "#f8fafc"
    ctx.font = "10px sans-serif"
    ctx.fillText("Magnitude", 15, 25)

    // Magnitude circles
    const magnitudes = [3, 4, 5]
    magnitudes.forEach((mag, i) => {
      const y = 40 + i * 15
      ctx.beginPath()
      ctx.arc(25, y, mag * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = "#f59e0b"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.fillStyle = "#f8fafc"
      ctx.fillText(`M${mag.toFixed(1)}`, 40, y + 3)
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

  return <canvas ref={canvasRef} className="w-full h-full" />
}

function AlertItem({
  title,
  time,
  description,
  type,
}: { title: string; time: string; description: string; type: "warning" | "info" | "update" | "success" }) {
  let iconColor
  switch (type) {
    case "warning":
      iconColor = "text-amber-500"
      break
    case "info":
      iconColor = "text-blue-500"
      break
    case "update":
      iconColor = "text-purple-500"
      break
    case "success":
      iconColor = "text-green-500"
      break
    default:
      iconColor = "text-gray-500"
      break
  }

  return (
    <div className="flex items-start space-x-3">
      <AlertCircle className={`h-4 w-4 ${iconColor}`} />
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-slate-400">{description}</div>
        <div className="text-xs text-slate-500">{time}</div>
      </div>
    </div>
  )
}

function CommunicationItem({
  sender,
  time,
  message,
  avatar,
  unread,
}: { sender: string; time: string; message: string; avatar: string; unread: boolean }) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={sender} />
        <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{sender}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-sm text-slate-400">{message}</div>
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Button
      variant="outline"
      className="w-full justify-center bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700 hover:text-slate-100"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [monitoringStatus, setMonitoringStatus] = useState(85)
  const [recentMagnitude, setRecentMagnitude] = useState(4.2)
  const [earthquakeDepth, setEarthquakeDepth] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [alertLevel, setAlertLevel] = useState(2)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [earthquakes, setEarthquakes] = useState<any[]>([])
  const [baseStations, setBaseStations] = useState(42)
  const [activeStations, setActiveStations] = useState(38)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
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

  // Simulate fetching earthquake data from EMCS
  useEffect(() => {
    const fetchEarthquakeData = async () => {
      try {
        // EMCS'den gerçek deprem verilerini çek
        const response = await fetch("https://www.seismicportal.eu/fdsnws/event/1/query?limit=10&format=json")
        const data = await response.json()

        if (data && data.features) {
          const earthquakes = data.features.map((feature: any) => {
            const properties = feature.properties
            const geometry = feature.geometry

            return {
              id: properties.source_id || feature.id,
              magnitude: properties.mag,
              depth: properties.depth / 1000, // Metre'den kilometre'ye çevirme
              location: geometry.coordinates.slice(0, 2).reverse(), // [lon, lat] -> [lat, lon]
              region: properties.flynn_region || "Bilinmeyen Bölge",
              timestamp: new Date(properties.time),
              felt: properties.felt || false,
            }
          })

          setEarthquakes(earthquakes)

          // En son depremi göster
          if (earthquakes.length > 0) {
            setRecentMagnitude(earthquakes[0].magnitude)
            setEarthquakeDepth(earthquakes[0].depth)
          }
        }
      } catch (error) {
        console.error("Deprem verisi çekerken hata oluştu:", error)
        // Hata durumunda simüle edilmiş veri kullan
        const simulatedData = Array.from({ length: 10 }, (_, i) => ({
          id: `eq-${Date.now()}-${i}`,
          magnitude: Number.parseFloat((Math.random() * 4 + 2).toFixed(1)),
          depth: Math.floor(Math.random() * 100) + 5,
          location: [
            Number.parseFloat((Math.random() * 60 - 30).toFixed(2)),
            Number.parseFloat((Math.random() * 60 + 10).toFixed(2)),
          ],
          region: [
            "İtalya",
            "Yunanistan",
            "Türkiye",
            "İspanya",
            "Portekiz",
            "Fransa",
            "Almanya",
            "Romanya",
            "Bulgaristan",
            "Hırvatistan",
          ][i],
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
          felt: Math.random() > 0.5,
        }))

        setEarthquakes(simulatedData)
      }
    }

    fetchEarthquakeData()
    const interval = setInterval(fetchEarthquakeData, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
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

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black to-slate-800 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-amber-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-red-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-orange-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-yellow-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-amber-500 font-mono text-sm tracking-wider">INITIALIZING SEISMIC MONITOR</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent">
              DEPREMİZLEME SİSTEMİ
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Depremleri ara..."
                className="bg-transparent border-none focus:outline-none text-sm w-40 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">CM</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Gösterge Paneli" active />
                  <NavItem icon={Waves} label="Sismik Aktivite" onClick={() => navigateTo("/sismik-aktivite")} />
                  <NavItem icon={MapPin} label="Konumlar" onClick={() => navigateTo("/konumlar")} />
                  <NavItem icon={Globe} label="Küresel Ağ" onClick={() => navigateTo("/kuresel-ag")} />
                  <NavItem icon={AlertTriangle} label="Uyarılar" onClick={() => navigateTo("/uyarilar")} />
                  <NavItem icon={Terminal} label="Konsol" onClick={() => navigateTo("/konsol")} />
                  <NavItem icon={MessageSquare} label="Raporlar" onClick={() => navigateTo("/raporlar")} />
                  <NavItem icon={Settings} label="Ayarlar" onClick={() => navigateTo("/ayarlar")} />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SİSTEM DURUMU</div>
                  <div className="space-y-3">
                    <StatusItem label="İzleme İstasyonları" value={monitoringStatus} color="amber" />
                    <StatusItem label="Uyarı Seviyesi" value={alertLevel * 20} color="red" />
                    <StatusItem label="Ağ Durumu" value={networkStatus} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* System overview */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      Sistem Genel Bakış
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                        LIVE
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                      title="Son Büyüklük"
                      value={recentMagnitude}
                      icon={Waves}
                      trend="up"
                      color="amber"
                      detail="Richter Ölçeği"
                      isDecimal={true}
                    />
                    <MetricCard
                      title="Derinlik"
                      value={earthquakeDepth}
                      icon={Mountain}
                      trend="stable"
                      color="purple"
                      detail="Kilometre"
                      isDecimal={false}
                    />
                    <MetricCard
                      title="İzleme"
                      value={networkStatus}
                      icon={Wifi}
                      trend="down"
                      color="blue"
                      detail="Çevrimiçi İstasyon"
                      isDecimal={false}
                    />
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="performance" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="performance"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-amber-400"
                          >
                            Aktivite
                          </TabsTrigger>
                          <TabsTrigger
                            value="processes"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-amber-400"
                          >
                            Son Depremler
                          </TabsTrigger>
                          <TabsTrigger
                            value="storage"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-amber-400"
                          >
                            Harita
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
                            Magnitude
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            Depth
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Frequency
                          </div>
                        </div>
                      </div>

                      <TabsContent value="performance" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <PerformanceChart />
                          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                            <div className="text-xs text-slate-400">Latest Activity</div>
                            <div className="text-lg font-mono text-amber-400">{recentMagnitude} ML</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="processes" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-2">Büyüklük</div>
                            <div className="col-span-2">Derinlik</div>
                            <div className="col-span-4">Konum</div>
                            <div className="col-span-2">Zaman</div>
                            <div className="col-span-1">Hissedildi</div>
                          </div>

                          <div className="divide-y divide-slate-700/30">
                            {earthquakes.slice(0, 6).map((eq) => (
                              <EarthquakeRow
                                key={eq.id}
                                id={eq.id.substring(0, 8)}
                                magnitude={eq.magnitude}
                                depth={eq.depth}
                                location={eq.region}
                                time={eq.timestamp}
                                felt={eq.felt}
                              />
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="storage" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <div className="h-64 w-full relative bg-slate-900/80 rounded-lg overflow-hidden">
                            <EarthquakeMap earthquakes={earthquakes} />
                            <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                              <div className="text-xs text-slate-400">Deprem Haritası</div>
                              <div className="text-xs text-slate-500">Avrupa-Akdeniz Bölgesi</div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <Waves className="mr-2 h-5 w-5 text-amber-500" />
                      İzleme Durumu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Sismograflar</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Aktif</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Erken Uyarı</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Aktif</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">Veri İletimi</div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Aktif</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">EMCS Bağlantısı</div>
                        <div className="text-sm text-amber-400">
                          Güncellendi <span className="text-slate-500">3 dk önce</span>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Uyarı Seviyesi</div>
                          <div className="text-sm text-amber-400">Seviye {alertLevel}/5</div>
                        </div>
                        <Progress value={alertLevel * 20} className="h-2 bg-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                            style={{ width: `${alertLevel * 20}%` }}
                          />
                        </Progress>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                      Deprem Uyarıları
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <AlertItem
                        title="M4.2 Earthquake Detected"
                        time="14:32:12"
                        description="Central Italy, 15km depth, no tsunami threat"
                        type="warning"
                      />
                      <AlertItem
                        title="Aftershock Sequence"
                        time="13:45:06"
                        description="Multiple aftershocks following M5.1 event"
                        type="info"
                      />
                      <AlertItem
                        title="Early Warning Issued"
                        time="09:12:45"
                        description="Potential for increased seismic activity"
                        type="update"
                      />
                      <AlertItem
                        title="All Clear"
                        time="04:30:00"
                        description="No significant seismic activity in last 6 hours"
                        type="success"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Communications */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Sismik Raporlar
                  </CardTitle>
                  <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
                    4 New Reports
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <CommunicationItem
                      sender="Athens Station"
                      time="15:42:12"
                      message="M3.8 earthquake recorded 25km NE of Athens. No damage reported. Monitoring for aftershocks."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Rome Station"
                      time="14:30:45"
                      message="Seismic swarm detected in Central Italy. 12 events under M3.0 in the last 6 hours."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="Istanbul Station"
                      time="12:15:33"
                      message="Increased activity along North Anatolian Fault. Recommend elevated monitoring status."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                    <CommunicationItem
                      sender="EMCS Central"
                      time="09:05:18"
                      message="Daily seismic summary: 28 events >M2.5 across European-Mediterranean region in last 24h."
                      avatar="/placeholder.svg?height=40&width=40"
                      unread
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-center w-full space-x-2">
                    <input
                      type="text"
                      placeholder="Rapor veya sorgu gönder..."
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <Button size="icon" className="bg-amber-600 hover:bg-amber-700">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-amber-600 hover:bg-amber-700">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* System time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">SİSTEM SAATİ</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Uptime</div>
                        <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                        <div className="text-sm font-mono text-slate-200">UTC-08:00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Hızlı Eylemler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={Waves} label="Sismik Tarama" />
                    <ActionButton icon={RefreshCw} label="EMCS Senkronizasyonu" />
                    <ActionButton icon={AlertTriangle} label="Uyarı Testi" />
                    <ActionButton icon={Terminal} label="Konsol" />
                  </div>
                </CardContent>
              </Card>

              {/* Resource allocation */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">İzleme Kaynakları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Seismograph Network</div>
                        <div className="text-xs text-amber-400">72% operational</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Data Processing</div>
                        <div className="text-xs text-purple-400">68% capacity</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: "68%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Alert Distribution</div>
                        <div className="text-xs text-blue-400">95% coverage</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-400">Sensitivity Level</div>
                        <div className="flex items-center">
                          <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                          <span className="text-amber-400">3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Base Stations */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Baz İstasyonları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">Toplam İstasyon</div>
                      <div className="text-sm font-medium text-amber-400">{baseStations}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">Aktif İstasyon</div>
                      <div className="text-sm font-medium text-green-400">{activeStations}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">Veri Akışı</div>
                      <div className="text-sm font-medium text-blue-400">
                        %{Math.round((activeStations / baseStations) * 100)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="text-xs text-slate-500 mb-2">İstasyon Konumları</div>
                      <div className="text-xs text-slate-400">
                        <ul className="space-y-1">
                          <li>• Kandilli Rasathanesi (İstanbul)</li>
                          <li>• AFAD Merkez (Ankara)</li>
                          <li>• Ege Üniversitesi (İzmir)</li>
                          <li>• Boğaziçi Üniversitesi (İstanbul)</li>
                          <li>• ODTÜ Deprem Merkezi (Ankara)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment controls */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">İzleme Ayarları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Waves className="text-amber-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Otomatik Uyarılar</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="text-amber-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Halk Bildirimleri</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Compass className="text-amber-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">Bölgesel Odak</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="text-amber-500 mr-2 h-4 w-4" />
                        <Label className="text-sm text-slate-400">24/7 İzleme</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
