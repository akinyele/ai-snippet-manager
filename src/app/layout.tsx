import { TRPCProvider } from '@/lib/trpc/Provider'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import {ErrorBoundary} from "@/components/error-boundary.";

export const metadata = {
    title: 'AI Snippet Manager',
    description: 'Save, search, and organize your code snippets with AI',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ErrorBoundary>
                <TRPCProvider>{children}</TRPCProvider>
            </ErrorBoundary>
        </ThemeProvider>
        </body>
        </html>
    )
}
