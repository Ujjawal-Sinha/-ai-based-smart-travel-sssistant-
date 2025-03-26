import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { destination, startDate, endDate, interests, travelWith } = await request.json()

    if (!destination || !startDate || !endDate || !interests || !travelWith) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const prompt = `
      Create a detailed travel itinerary for ${destination} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.
      The trip is for ${dayDiff} days.
      Interests: ${interests.join(", ")}.
      Traveling with: ${travelWith}.
      
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
    `

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
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.choices[0].message.content,
    })
  } catch (error) {
    console.error("Error in itinerary API:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}

