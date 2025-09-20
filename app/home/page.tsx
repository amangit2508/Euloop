"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { ComplaintForm, Complaint } from "@/components/complaint-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])

  // Load complaints from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("complaints")
    if (stored) setComplaints(JSON.parse(stored))
  }, [])

  // Redirect if not logged in
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

  if (!user) return null

  // Compute counts dynamically
  const totalCount = complaints.length
  const pendingCount = complaints.filter(c => c.status === "pending").length
  const resolvedCount = complaints.filter(c => c.status === "resolved").length

  // Function to mark a complaint as resolved
  const resolveComplaint = (id: number) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: "resolved" } : c)
    setComplaints(updated)
    localStorage.setItem("complaints", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Submit and track your complaints efficiently</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Complaints</CardTitle>
                <CardDescription>All time submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending</CardTitle>
                <CardDescription>Awaiting response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resolved</CardTitle>
                <CardDescription>Successfully handled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit New Complaint</CardTitle>
              <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintForm
                onSubmit={(newComplaint) => {
                  setComplaints(prev => {
                    const updated = [...prev, newComplaint]
                    localStorage.setItem("complaints", JSON.stringify(updated))
                    return updated
                  })
                }}
              />
            </CardContent>
          </Card>

          {/* List of complaints with "Mark Resolved" button */}
          {complaints.length > 0 && (
            <div className="grid gap-4">
              {complaints.map(c => (
                <Card key={c.id}>
                  <CardHeader>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>Status: {c.status}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <p>{c.description}</p>
                    {c.status === "pending" && (
                      <Button size="sm" variant="secondary" onClick={() => resolveComplaint(c.id)}>
                        Mark Resolved
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
