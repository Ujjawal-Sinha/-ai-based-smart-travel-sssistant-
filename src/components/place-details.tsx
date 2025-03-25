import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Star, Clock, Info } from "lucide-react"

interface Place {
  name: string
  description: string
  type: string
  rating?: number
  visitDuration?: string
  address?: string
}

interface PlaceDetailsProps {
  destination: string
  places: Place[]
}

export default function PlaceDetails({ destination, places }: PlaceDetailsProps) {
  if (!places || places.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No place details available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Places to Visit in {destination}</h2>
        <p className="text-muted-foreground">Discover the best attractions and hidden gems</p>
      </div>

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
        {places.map((place, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{place.name}</CardTitle>
                <Badge variant="outline">{place.type}</Badge>
              </div>
              {place.address && (
                <CardDescription className="flex items-center text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {place.address}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{place.description}</p>

              <Separator />

              <div className="flex justify-between items-center text-sm">
                {place.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{place.rating.toFixed(1)}</span>
                  </div>
                )}

                {place.visitDuration && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{place.visitDuration}</span>
                  </div>
                )}

                {!place.rating && !place.visitDuration && (
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    <span>Popular attraction</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

