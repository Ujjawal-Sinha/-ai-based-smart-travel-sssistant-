"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PackageOpen, Shirt, Umbrella, Utensils, Backpack } from "lucide-react"

interface PackingItem {
  name: string
  category: string
  essential: boolean
  weatherDependent?: boolean
  activityDependent?: string[]
}

interface PackingListProps {
  packingItems: PackingItem[]
  weather: any[]
  activities: string[]
}

export default function PackingList({ packingItems, weather, activities }: PackingListProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  if (!packingItems || packingItems.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No packing list available.</p>
      </div>
    )
  }

  const categories = Array.from(new Set(packingItems.map((item) => item.category)))

  const handleItemCheck = (itemName: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }))
  }

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase()
    if (categoryLower.includes("cloth")) {
      return <Shirt className="h-4 w-4" />
    } else if (categoryLower.includes("weather") || categoryLower.includes("rain")) {
      return <Umbrella className="h-4 w-4" />
    } else if (categoryLower.includes("food") || categoryLower.includes("kitchen")) {
      return <Utensils className="h-4 w-4" />
    } else {
      return <Backpack className="h-4 w-4" />
    }
  }

  const getProgress = () => {
    const totalItems = packingItems.length
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    return {
      percentage: totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0,
      checked: checkedCount,
      total: totalItems,
    }
  }

  const progress = getProgress()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Packing List</h2>
        <p className="text-muted-foreground">Customized for your activities and weather conditions</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <PackageOpen className="h-5 w-5 mr-2" />
              Packing Progress
            </CardTitle>
            <Badge variant={progress.percentage === 100 ? "secondary" : "outline"}>
      {progress.checked}/{progress.total} items
    </Badge>
          </div>
          <CardDescription>
            {progress.percentage === 100 ? "All packed and ready to go!" : `${progress.percentage}% packed`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2.5 mb-4">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="w-full justify-start px-4 pt-4 bg-transparent flex-wrap h-auto gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="p-4 pt-6">
                <div className="space-y-3">
                  {packingItems
                    .filter((item) => item.category === category)
                    .map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Checkbox
                          id={`item-${category}-${index}`}
                          checked={checkedItems[item.name] || false}
                          onCheckedChange={() => handleItemCheck(item.name)}
                          className="mt-1"
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor={`item-${category}-${index}`}
                              className={`font-medium ${checkedItems[item.name] ? "line-through text-muted-foreground" : ""}`}
                            >
                              {item.name}
                            </Label>
                            {item.essential && (
                              <Badge variant="secondary" className="text-xs">
                                Essential
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.weatherDependent && (
                              <Badge variant="outline" className="text-xs bg-blue-50">
                                Weather
                              </Badge>
                            )}
                            {item.activityDependent &&
                              item.activityDependent.some((act) => activities.includes(act)) && (
                                <Badge variant="outline" className="text-xs bg-green-50">
                                  Activity
                                </Badge>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

