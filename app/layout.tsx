import type React from "react"
import type { Metadata } from "next"
import { Roboto, Poppins, Merriweather, Playfair_Display, Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { TextModalInitializer } from "@/components/text-modal-initializer"

// Define fonts
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
})

const playfair = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

const openSans = Open_Sans({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
})

export const metadata: Metadata = {
  title: "Document Builder",
  description: "A Canva-like document builder with Material Design 3",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body
        className={`${roboto.variable} ${poppins.variable} ${merriweather.variable} ${playfair.variable} ${montserrat.variable} ${openSans.variable}`}
      >
        <TextModalInitializer />
        {children}
      </body>
    </html>
  )
}
