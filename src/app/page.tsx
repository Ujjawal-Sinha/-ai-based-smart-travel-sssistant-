"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, PackageOpen, Cloud, Clock } from "lucide-react"
import { generateItinerary } from "@/lib/actions"
import TravelItinerary from "@/components/travel-itinerary"
import PlaceDetails from "@/components/place-details"
import WeatherInfo from "@/components/weather-info"
import PackingList from "@/components/packing-list"
import GoogleMap from "@/components/google-map"

const interests = [
  { id: "adventure", label: "Adventure" },
  { id: "sightseeing", label: "Sightseeing" },
  { id: "historical", label: "Historical" },
  { id: "spiritual", label: "Spiritual" },
  { id: "culinary", label: "Culinary" },
  { id: "shopping", label: "Shopping" },
  { id: "nature", label: "Nature" },
  { id: "cultural", label: "Cultural" },
  { id: "relaxation", label: "Relaxation" },
  { id: "nightlife", label: "Nightlife" },
]

const travelCompanions = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "Friends" },
]

export default function Home() {
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [travelWith, setTravelWith] = useState("")
  const [loading, setLoading] = useState(false)
  const [itineraryData, setItineraryData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("itinerary")

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interest])
    } else {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!destination || !startDate || !endDate || selectedInterests.length === 0 || !travelWith) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const data = await generateItinerary({
        destination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        interests: selectedInterests,
        travelWith,
      })

      if (!data || !data.itinerary) {
        throw new Error("Invalid response data")
      }

      setItineraryData(data)
      setActiveTab("itinerary")
    } catch (error) {
      console.error("Error generating itinerary:", error)
      alert("Failed to generate itinerary. Please try again or check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Travel Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Plan Your Trip</CardTitle>
            <CardDescription>Fill in the details below to generate your personalized travel itinerary</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="e.g., Tokyo, Japan"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={selectedInterests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked === true)}
                      />
                      <Label htmlFor={interest.id} className="cursor-pointer">
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelWith">Traveling With</Label>
                <Select value={travelWith} onValueChange={setTravelWith}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select who you're traveling with" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelCompanions.map((companion) => (
                      <SelectItem key={companion.value} value={companion.value}>
                        {companion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Itinerary...
                  </>
                ) : (
                  "Generate Itinerary"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          {itineraryData ? (
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="itinerary" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Itinerary</span>
                  </TabsTrigger>
                  <TabsTrigger value="places" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Places</span>
                  </TabsTrigger>
                  <TabsTrigger value="weather" className="flex items-center gap-1">
                    <Cloud className="h-4 w-4" />
                    <span>Weather</span>
                  </TabsTrigger>
                  <TabsTrigger value="packing" className="flex items-center gap-1">
                    <PackageOpen className="h-4 w-4" />
                    <span>Packing</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary" className="p-4">
                  <TravelItinerary itinerary={itineraryData.itinerary} />
                </TabsContent>

                <TabsContent value="places" className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <PlaceDetails destination={destination} places={itineraryData.places} />
                    </div>
                    <div className="md:col-span-1 h-[500px]">
                      <GoogleMap destination={destination} places={itineraryData.places} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weather" className="p-4">
                  <WeatherInfo destination={destination} weather={itineraryData.weather} />
                </TabsContent>

                <TabsContent value="packing" className="p-4">
                  <PackingList
                    packingItems={itineraryData.packingList}
                    weather={itineraryData.weather}
                    activities={selectedInterests}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
              <img src="/placeholder.svg?height=200&width=10" alt="Travel illustration" className="mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2">Ready to plan your adventure?</h3>
              <p className="text-muted-foreground max-w-md">
                Fill in your travel details on the left and click "Generate Itinerary" to create your personalized
                travel plan.
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </main>
  )
}

