import type React from "react"
import { Inter, DM_Serif_Text, Iceland, Almendra_SC, Bungee_Spice, Nabla } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSerifText = DM_Serif_Text({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" })
const almendra = Almendra_SC({ weight: "400", subsets: ["latin"], variable: "--font-almendra" })
const iceland = Iceland({ weight: "400", subsets: ["latin"], variable: "--font-iceland" })
const bungeeSpice = Bungee_Spice({ weight: "400", subsets: ["latin"], variable: "--font-bungee-spice" })
const nabla = Nabla({ weight: "400", subsets: ["latin"], variable: "--font-nabla" })

export const metadata = {
  title: "Rising Transfers",
  description: "AI-powered global football transfer intelligence system",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${dmSerifText.variable} ${almendra.variable} ${iceland.variable} ${bungeeSpice.variable} ${nabla.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
