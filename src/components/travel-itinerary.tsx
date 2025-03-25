"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, Sun, Moon, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Activity {
  time: string
  title: string
  description: string
  location?: string
}

interface DayPlan {
  date: string
  morning: Activity[]
  afternoon: Activity[]
  evening: Activity[]
}

interface TravelItineraryProps {
  itinerary: DayPlan[]
}

export default function TravelItinerary({ itinerary }: TravelItineraryProps) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No itinerary data available. Please try generating a new itinerary.</p>
      </div>
    )
  }

  const currentDay = itinerary[currentDayIndex]

  // Add check for currentDay
  if (!currentDay) {
    return (
      <div className="text-center p-8">
        <p>Invalid itinerary data. Please try generating a new itinerary.</p>
      </div>
    )
  }

  const handlePrevDay = () => {
    setCurrentDayIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => Math.min(itinerary.length - 1, prev + 1))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const renderActivities = (activities: Activity[]) => {
    return activities.map((activity, index) => (
      <div key={index} className="mb-4 border-l-2 border-primary pl-4 py-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-base">{activity.title}</h4>
          <Badge variant="outline" className="text-xs">
            {activity.time}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
        {activity.location && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 mr-1"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {activity.location}
            </span>
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Travel Itinerary</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay} disabled={currentDayIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Day {currentDayIndex + 1} of {itinerary.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            disabled={currentDayIndex === itinerary.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{formatDate(currentDay.date)}</CardTitle>
          <CardDescription>Day {currentDayIndex + 1} of your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="morning">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="morning" className="flex items-center gap-1">
                <Coffee className="h-4 w-4" />
                <span>Morning</span>
              </TabsTrigger>
              <TabsTrigger value="afternoon" className="flex items-center gap-1">
                <Sun className="h-4 w-4" />
                <span>Afternoon</span>
              </TabsTrigger>
              <TabsTrigger value="evening" className="flex items-center gap-1">
                <Moon className="h-4 w-4" />
                <span>Evening</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="morning">{renderActivities(currentDay.morning)}</TabsContent>

            <TabsContent value="afternoon">{renderActivities(currentDay.afternoon)}</TabsContent>

            <TabsContent value="evening">{renderActivities(currentDay.evening)}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

