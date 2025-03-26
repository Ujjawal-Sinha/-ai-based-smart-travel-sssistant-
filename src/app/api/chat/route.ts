'use server'

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
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
              `You are a helpful travel assistant. 
              Provide concise, accurate information about destinations, 
              travel tips, local customs, attractions, and answer
               any travel-related questions. If asked about specific itineraries,
                refer to the travel planner feature of the application.`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Azure OpenAI API error:", errorData)
      throw new Error(`API error: ${response.status}`)
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}

