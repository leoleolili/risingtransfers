import type React from "react"
import { Inter, DM_Serif_Text, Iceland, Almendra_SC, Bungee_Spice, Nabla, Bungee_Shade, Rubik_Doodle_Shadow, Bungee_Tint, Roboto, Poppins, New_Rocker, Merriweather } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSerifText = DM_Serif_Text({ weight: "400", subsets: ["latin"], variable: "--font-dm-serif" })
const almendra = Almendra_SC({ weight: "400", subsets: ["latin"], variable: "--font-almendra" })
const iceland = Iceland({ weight: "400", subsets: ["latin"], variable: "--font-iceland" })
const bungeeSpice = Bungee_Spice({ weight: "400", subsets: ["latin"], variable: "--font-bungee-spice" })
const nabla = Nabla({ weight: "400", subsets: ["latin"], variable: "--font-nabla" })
const bungeeShade = Bungee_Shade({ weight: "400", subsets: ["latin"], variable: "--font-bungee-shade" })
const rubikDoodleShadow = Rubik_Doodle_Shadow({ weight: "400", subsets: ["latin"], variable: "--font-rubik-doodle-shadow" })
const bungeeTint = Bungee_Tint({ weight: "400", subsets: ["latin"], variable: "--font-bungee-tint" })
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-roboto" })
const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-poppins" })
const newRocker = New_Rocker({ weight: "400", subsets: ["latin"], variable: "--font-new-rocker" })
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: "--font-merriweather" })

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
      <body className={`${inter.className} ${dmSerifText.variable} ${almendra.variable} ${iceland.variable} ${bungeeSpice.variable} ${nabla.variable} ${bungeeShade.variable} ${rubikDoodleShadow.variable} ${bungeeTint.variable} ${roboto.variable} ${poppins.variable} ${newRocker.variable} ${merriweather.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
