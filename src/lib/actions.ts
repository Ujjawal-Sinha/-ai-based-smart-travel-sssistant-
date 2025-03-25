"use server"

interface ItineraryRequest {
  destination: string
  startDate: string
  endDate: string
  interests: string[]
  travelWith: string
}

// Replace the generateItinerary function with this implementation that uses the actual Azure OpenAI API

export async function generateItinerary(request: ItineraryRequest) {
  try {
    // Calculate the number of days for the itinerary
    const start = new Date(request.startDate)
    const end = new Date(request.endDate)
    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Create a prompt for the AI
    const prompt = `
      Create a detailed travel itinerary for ${request.destination} from ${new Date(request.startDate).toLocaleDateString()} to ${new Date(request.endDate).toLocaleDateString()}.
      The trip is for ${dayDiff} days.
      Interests: ${request.interests.join(", ")}.
      Traveling with: ${request.travelWith}.
      
      Please provide a complete travel plan in JSON format with the following structure:
      {
        "itinerary": [
          {
            "date": "YYYY-MM-DD",
            "morning": [
              {
                "time": "time range",
                "title": "activity name",
                "description": "detailed description",
                "location": "location name"
              }
            ],
            "afternoon": [similar structure as morning],
            "evening": [similar structure as morning]
          }
        ],
        "places": [
          {
            "name": "place name",
            "description": "detailed description",
            "type": "category (Historical, Nature, etc.)",
            "rating": number (1-5),
            "visitDuration": "estimated visit time",
            "address": "address"
          }
        ],
        "weather": [
          {
            "date": "YYYY-MM-DD",
            "condition": "weather condition",
            "temperature": {
              "min": number,
              "max": number,
              "unit": "C"
            },
            "precipitation": number (percentage),
            "humidity": number (percentage),
            "windSpeed": number
          }
        ],
        "packingList": [
          {
            "name": "item name",
            "category": "category name",
            "essential": boolean,
            "weatherDependent": boolean (optional),
            "activityDependent": [array of activities] (optional)
          }
        ]
      }
      
      Make sure to include activities that match the specified interests and are appropriate for the travel companions.
      For the weather, provide realistic forecasts based on the destination and time of year.
      For the packing list, include items that are appropriate for the activities, weather, and destination.
    `

    // Call the Azure OpenAI API
    const response = await fetch(process.env.ENDPOINT as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.API_KEY as string,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a travel planning assistant. Generate detailed travel itineraries in JSON format only. Do not include any explanatory text outside the JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Azure OpenAI API error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Parse the JSON response from the content field
    try {
      // The response should be in the choices[0].message.content field
      const jsonContent = data.choices[0].message.content
      const itineraryData = JSON.parse(jsonContent)
      return itineraryData
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", data)

      // Fallback to mock data if parsing fails
      return generateMockItineraryData(request.destination, start, dayDiff, request.interests, request.travelWith)
    }
  } catch (error) {
    console.error("Error generating itinerary:", error)

    // For development/demo purposes, fall back to mock data if the API call fails
    const start = new Date(request.startDate)
    const end = new Date(request.endDate)
    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return generateMockItineraryData(request.destination, start, dayDiff, request.interests, request.travelWith)
  }
}

// Keep the generateMockItineraryData function as a fallback

function generateMockItineraryData(
  destination: string,
  startDate: Date,
  days: number,
  interests: string[],
  travelWith: string,
) {
  // Mock data for demonstration purposes
  const itinerary = []
  const isAdventure = interests.includes("adventure")
  const isHistorical = interests.includes("historical")
  const isCulinary = interests.includes("culinary")
  const isNature = interests.includes("nature")
  const isSightseeing = interests.includes("sightseeing")

  // Generate daily itinerary
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const dayPlan = {
      date: currentDate.toISOString().split("T")[0],
      morning: [
        {
          time: "8:00 AM - 9:00 AM",
          title: "Breakfast",
          description: isCulinary
            ? "Enjoy a local breakfast at a popular café with authentic cuisine."
            : "Breakfast at the hotel or a nearby café.",
          location: "Local Café",
        },
        {
          time: "9:30 AM - 12:00 PM",
          title: isHistorical ? "Historical Site Visit" : isNature ? "Nature Walk" : "City Tour",
          description: isHistorical
            ? `Explore the historical landmarks of ${destination} with a guided tour.`
            : isNature
              ? `Morning hike through the beautiful natural landscapes of ${destination}.`
              : `Guided tour of ${destination}'s main attractions.`,
          location: isHistorical ? "Historical District" : isNature ? "Nature Reserve" : "City Center",
        },
      ],
      afternoon: [
        {
          time: "12:30 PM - 2:00 PM",
          title: "Lunch",
          description: isCulinary
            ? "Savor local delicacies at a renowned restaurant."
            : "Lunch at a recommended restaurant.",
          location: "Downtown Restaurant",
        },
        {
          time: "2:30 PM - 5:00 PM",
          title: isAdventure ? "Adventure Activity" : isSightseeing ? "Sightseeing" : "Museum Visit",
          description: isAdventure
            ? `Experience thrilling ${i % 2 === 0 ? "water sports" : "hiking trails"} in ${destination}.`
            : isSightseeing
              ? `Visit the iconic landmarks of ${destination}.`
              : `Explore the cultural heritage at ${destination}'s museums.`,
          location: isAdventure
            ? i % 2 === 0
              ? "Adventure Park"
              : "Mountain Trails"
            : isSightseeing
              ? "Tourist Attractions"
              : "National Museum",
        },
      ],
      evening: [
        {
          time: "6:00 PM - 7:30 PM",
          title: "Dinner",
          description: isCulinary
            ? "Fine dining experience with local specialties and wine pairing."
            : "Dinner at a popular local restaurant.",
          location: "Waterfront Restaurant",
        },
        {
          time: "8:00 PM - 10:00 PM",
          title: interests.includes("nightlife") ? "Nightlife Experience" : "Evening Relaxation",
          description: interests.includes("nightlife")
            ? `Experience the vibrant nightlife of ${destination} with local music and entertainment.`
            : `Relaxing evening stroll along the ${i % 2 === 0 ? "beach" : "city streets"}.`,
          location: interests.includes("nightlife")
            ? "Entertainment District"
            : i % 2 === 0
              ? "Beachfront"
              : "Old Town",
        },
      ],
    }

    itinerary.push(dayPlan)
  }

  // Generate places to visit
  const places = [
    {
      name: `${destination} Historical Museum`,
      description: `Discover the rich history of ${destination} through interactive exhibits and ancient artifacts.`,
      type: "Historical",
      rating: 4.7,
      visitDuration: "2-3 hours",
      address: `123 Museum Ave, ${destination}`,
    },
    {
      name: `${destination} National Park`,
      description: `Experience the natural beauty of ${destination} with stunning landscapes and diverse wildlife.`,
      type: "Nature",
      rating: 4.9,
      visitDuration: "Half day",
      address: `National Park Road, ${destination}`,
    },
    {
      name: `${destination} Cultural Center`,
      description: `Immerse yourself in the local culture through art exhibitions, performances, and workshops.`,
      type: "Cultural",
      rating: 4.5,
      visitDuration: "1-2 hours",
      address: `45 Culture St, ${destination}`,
    },
    {
      name: `${destination} Marketplace`,
      description: `Shop for local crafts, souvenirs, and taste authentic street food at this bustling market.`,
      type: "Shopping",
      rating: 4.3,
      visitDuration: "2 hours",
      address: `Market Square, ${destination}`,
    },
    {
      name: `${destination} Viewpoint`,
      description: `Enjoy panoramic views of the entire city from this elevated viewpoint.`,
      type: "Sightseeing",
      rating: 4.8,
      visitDuration: "1 hour",
      address: `Hilltop Road, ${destination}`,
    },
    {
      name: isAdventure ? `${destination} Adventure Park` : `${destination} Botanical Gardens`,
      description: isAdventure
        ? `Get your adrenaline pumping with various adventure activities like zip-lining and rock climbing.`
        : `Stroll through beautiful gardens featuring local and exotic plant species.`,
      type: isAdventure ? "Adventure" : "Nature",
      rating: 4.6,
      visitDuration: isAdventure ? "Full day" : "2-3 hours",
      address: `${isAdventure ? "Adventure" : "Garden"} Road, ${destination}`,
    },
  ]

  // Generate weather information
  const weather = []
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    const weatherConditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

    weather.push({
      date: currentDate.toISOString().split("T")[0],
      condition: randomCondition,
      temperature: {
        min: Math.floor(Math.random() * 10) + 15,
        max: Math.floor(Math.random() * 10) + 25,
        unit: "C",
      },
      precipitation: Math.floor(Math.random() * 30),
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 20) + 5,
    })
  }

  // Generate packing list based on interests and weather
  const packingList = [
    {
      name: "Passport and ID",
      category: "Documents",
      essential: true,
    },
    {
      name: "Travel Insurance Documents",
      category: "Documents",
      essential: true,
    },
    {
      name: "Credit Cards and Cash",
      category: "Documents",
      essential: true,
    },
    {
      name: "Phone and Charger",
      category: "Electronics",
      essential: true,
    },
    {
      name: "Camera",
      category: "Electronics",
      essential: false,
    },
    {
      name: "Power Adapter",
      category: "Electronics",
      essential: true,
    },
    {
      name: "T-shirts",
      category: "Clothing",
      essential: true,
    },
    {
      name: "Pants/Shorts",
      category: "Clothing",
      essential: true,
    },
    {
      name: "Underwear and Socks",
      category: "Clothing",
      essential: true,
    },
    {
      name: "Comfortable Walking Shoes",
      category: "Footwear",
      essential: true,
    },
    {
      name: "Jacket/Sweater",
      category: "Clothing",
      essential: true,
      weatherDependent: true,
    },
    {
      name: "Rain Jacket",
      category: "Weather Gear",
      essential: false,
      weatherDependent: true,
    },
    {
      name: "Umbrella",
      category: "Weather Gear",
      essential: false,
      weatherDependent: true,
    },
    {
      name: "Sunscreen",
      category: "Toiletries",
      essential: true,
      weatherDependent: true,
    },
    {
      name: "Sunglasses",
      category: "Accessories",
      essential: false,
      weatherDependent: true,
    },
    {
      name: "Hat/Cap",
      category: "Accessories",
      essential: false,
      weatherDependent: true,
    },
    {
      name: "Hiking Boots",
      category: "Footwear",
      essential: false,
      activityDependent: ["adventure", "nature"],
    },
    {
      name: "Swimwear",
      category: "Clothing",
      essential: false,
      activityDependent: ["adventure"],
    },
    {
      name: "First Aid Kit",
      category: "Health",
      essential: true,
    },
    {
      name: "Prescription Medications",
      category: "Health",
      essential: true,
    },
    {
      name: "Water Bottle",
      category: "Accessories",
      essential: true,
    },
    {
      name: "Daypack/Small Backpack",
      category: "Bags",
      essential: true,
    },
    {
      name: "Travel Pillow",
      category: "Comfort",
      essential: false,
    },
    {
      name: "Travel Guide Book",
      category: "Entertainment",
      essential: false,
    },
    {
      name: "Portable Charger",
      category: "Electronics",
      essential: false,
    },
  ]

  // Return the complete mock data
  return {
    itinerary,
    places,
    weather,
    packingList,
  }
}

