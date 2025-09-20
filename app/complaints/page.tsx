"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Complaint {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: "pending" | "in-progress" | "resolved"
  location?: string
  media?: string[]
  userId: string
  createdAt: string
}

export default function ComplaintsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("complaints") || "[]")
      const userComplaints = allComplaints.filter(c => c.userId === user.id)
      setComplaints(userComplaints)
    }
  }, [user])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markResolved = (complaintId: string) => {
    const updatedComplaints = complaints.map(c =>
      c.id === complaintId ? { ...c, status: "resolved" } : c
    )
    setComplaints(updatedComplaints)

    // Update localStorage
    const allComplaints: Complaint[] = JSON.parse(localStorage.getItem("complaints") || "[]")
    const updatedAll = allComplaints.map(c =>
      c.id === complaintId ? { ...c, status: "resolved" } : c
    )
    localStorage.setItem("complaints", JSON.stringify(updatedAll))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Complaints</h1>
            <p className="text-muted-foreground">Track the status of all your submitted complaints</p>
          </div>

          {complaints.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">No complaints submitted yet</p>
                <p className="text-sm text-muted-foreground mt-2">Go to the home page to submit your first complaint</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {complaints.map((complaint) => (
                <Card key={complaint.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {complaint.category} • {new Date(complaint.createdAt).toLocaleDateString()}
                        </CardDescription>
                        {complaint.location && (
                          <p className="text-sm text-muted-foreground mt-1">📍 {complaint.location}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status === "resolved" ? "Resolved" : complaint.status}
                        </Badge>
                        <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{complaint.description}</p>

                    {complaint.media && complaint.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {complaint.media.map((m, idx) =>
                          m.startsWith("data:video") ? (
                            <video key={idx} src={m} controls className="w-40 h-40 object-cover rounded" />
                          ) : (
                            <img key={idx} src={m} alt={`media-${idx}`} className="w-40 h-40 object-cover rounded" />
                          )
                        )}
                      </div>
                    )}

                    {complaint.status !== "resolved" && (
                      <Button onClick={() => markResolved(complaint.id)}>Mark as Resolved</Button>
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
