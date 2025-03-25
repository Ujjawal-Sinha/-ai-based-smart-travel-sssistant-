import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react"

interface WeatherDay {
  date: string
  condition: string
  temperature: {
    min: number
    max: number
    unit: string
  }
  precipitation: number
  humidity: number
  windSpeed: number
}

interface WeatherInfoProps {
  destination: string
  weather: WeatherDay[]
}

export default function WeatherInfo({ destination, weather }: WeatherInfoProps) {
  if (!weather || weather.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No weather information available.</p>
      </div>
    )
  }

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else if (conditionLower.includes("cloud")) {
      return <Cloud className="h-8 w-8 text-gray-500" />
    } else if (conditionLower.includes("sun") || conditionLower.includes("clear")) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else {
      return <Cloud className="h-8 w-8 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Weather Forecast for {destination}</h2>
        <p className="text-muted-foreground">Plan accordingly with the latest weather information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weather.map((day, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2 bg-muted/50">
              <CardTitle className="text-lg">{formatDate(day.date)}</CardTitle>
              <CardDescription>{day.condition}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-1 text-red-500" />
                  <span className="font-medium">
                    {day.temperature.min}° - {day.temperature.max}°{day.temperature.unit}
                  </span>
                </div>
                <div>{getWeatherIcon(day.condition)}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                  <CloudRain className="h-4 w-4 mb-1 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Precip</span>
                  <span>{day.precipitation}%</span>
                </div>

                <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                  <Droplets className="h-4 w-4 mb-1 text-blue-400" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                  <span>{day.humidity}%</span>
                </div>

                <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
                  <Wind className="h-4 w-4 mb-1 text-gray-500" />
                  <span className="text-xs text-muted-foreground">Wind</span>
                  <span>{day.windSpeed} km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

