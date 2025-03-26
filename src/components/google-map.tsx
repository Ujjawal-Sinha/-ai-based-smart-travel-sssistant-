"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

declare global {
  interface Window {
    google: any; 
  }
}

interface Place {
  name: string
  address?: string
}

interface GoogleMapProps {
  destination: string
  places: Place[]
}

export default function GoogleMap({ destination, places }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google) {
          resolve(); 
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC_iA-qprI1m5MfNfHocziJmvvqe3ed6lE&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.head.appendChild(script);
      });
    };

    loadGoogleMapsApi()
      .then(() => {
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: 12,
          });

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: destination }, (results: { geometry: { location: any } }[], status: string) => {
            if (status === "OK" && results && results[0]) {
              map.setCenter(results[0].geometry.location);
              
              places.forEach(place => {
                if (place.address) {
                  geocoder.geocode({ address: place.address }, (results: { geometry: { location: any } }[], status: string) => {
                    if (status === "OK" && results && results[0]) {
                      new window.google.maps.Marker({
                        map,
                        position: results[0].geometry.location,
                        title: place.name
                      });
                    }
                  });
                }
              });
            } else {
              setError("Could not find location on map");
            }
          });
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      
    }
  }, [destination, places])

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please check your internet connection or try again later.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      {loading ? (
        <div className="h-full w-full p-4">
          <Skeleton className="h-full w-full rounded-md" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="relative h-full w-full">
          <div ref={mapRef} className="h-full w-full bg-slate-100 flex items-center justify-center">
            <div className="text-center p-4">
              <h3 className="font-medium text-lg mb-2">{destination}</h3>
              <p className="text-sm text-muted-foreground mb-4">Map showing {places.length} locations</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-left">
                {places.slice(0, 6).map((place, index) => (
                  <div key={index} className="bg-white p-2 rounded-md shadow-sm">
                    <p className="font-medium truncate">{place.name}</p>
                    {place.address && (
                      <p className="text-muted-foreground truncate">
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            place.address
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {place.address}
                        </Link>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
