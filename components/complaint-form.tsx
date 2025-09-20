"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

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

interface ComplaintFormProps {
  onSubmit?: (complaint: Complaint) => void
}

export function ComplaintForm({ onSubmit }: ComplaintFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [location, setLocation] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title || !description || !category || !priority || !location) {
      setError("Please fill in all fields, including location")
      return
    }

    setIsSubmitting(true)

    const mediaURLs = await Promise.all(
      mediaFiles.map(file => new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      }))
    )

    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const complaint: Complaint = {
        id: Date.now().toString(),
        title,
        description,
        category,
        priority,
        status: "pending",
        location,
        media: mediaURLs,
        userId: user?.id || "",
        createdAt: new Date().toISOString(),
      }

      const complaints = JSON.parse(localStorage.getItem("complaints") || "[]")
      complaints.push(complaint)
      localStorage.setItem("complaints", JSON.stringify(complaints))

      if (onSubmit) onSubmit(complaint)

      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("")
      setLocation("")
      setMediaFiles([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Failed to submit complaint. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reusable class for hover effect on all input boxes
  const hoverEffectClass = "relative border border-transparent rounded-md p-2 transition-all duration-500 hover:shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] focus:shadow-[0_0_15px_3px_rgba(59,130,246,0.5)]"

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-lg relative border border-transparent hover:border-transparent hover:shadow-[0_0_20px_3px_rgba(59,130,246,0.5)] transition-all duration-500 bg-white"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Complaint Title</Label>
          <Input
            id="title"
            placeholder="Brief description of your issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className={hoverEffectClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            disabled={isSubmitting}
            className={hoverEffectClass}
          >
            <SelectTrigger className={hoverEffectClass}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Garbage">Garbage</SelectItem>
              <SelectItem value="Path Holes">Path Holes</SelectItem>
              <SelectItem value="Service Quality">Service Quality</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Water Pipeline">Water Pipeline</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select
            value={priority}
            onValueChange={setPriority}
            disabled={isSubmitting}
            className={hoverEffectClass}
          >
            <SelectTrigger className={hoverEffectClass}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSubmitting}
            className={hoverEffectClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Please provide detailed information about your complaint..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={5}
          className={hoverEffectClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="media">Upload Image/Video</Label>
        <Input
          id="media"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleMediaChange}
          disabled={isSubmitting}
          className={hoverEffectClass}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Complaint submitted successfully! We'll review it and get back to you soon.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </Button>
    </form>
  )
}
