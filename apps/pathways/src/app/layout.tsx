import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // This import is correct
import { GlobalBottomNavBar } from '@oursynth/ui';
import CustomThemeProvider from "../theme/CustomThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OurSynth Pathways - Project Wizard",
  description: "Create your next project with our intelligent wizard. Choose templates, configure features, and deploy with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}>
        <CustomThemeProvider>
          {children}
          <GlobalBottomNavBar />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(30, 41, 59, 0.95)',
                color: '#ffffff',
                border: '1px solid #374151',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
