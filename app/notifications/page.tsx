"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"

export default function NotificationsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated on your complaint status and system updates</p>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                You'll receive updates here when there are changes to your complaints
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
