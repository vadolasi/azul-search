"use client"

import { useEffect, useState } from "react"

interface Props {
  flight: {
    id: string
    originAirport: string
    originAirportName: string
    finalDestination: string
    finalDestinationName: string
    operatingCarriers: string[]
    prices: {
      value: number
      currency: string
      classType: string
    }[]
  }
  cabin: string
  derpatureDateTime: string
}

const FlightPoints: React.FC<Props> = ({ flight, cabin, derpatureDateTime }) => {
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      const response = await fetch("https://interline.tudoazul.com/exchange/api/v1/exchange/getPoints", {
        method: "POST",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
          items: {
            origin: flight.originAirport,
            destination: flight.finalDestination,
            cabin,
            classType: flight.prices[0].classType,
            departureDate: derpatureDateTime,
            partner: flight.operatingCarriers[0]
          },
          value: {
            currency: flight.prices[0].currency,
            value: flight.prices[0].value
          }
        })
      })

      const data = await response.json()

      setPoints(data.value as number)
    })()
  }, [])

  return (
    <div className="flex gap-4 text-xs">
      {points === null ? (
        <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
      ) : (
        <>
          <span className="text-center">{points / 1000} mil</span>
        </>
      )}
    </div>
  )
}

export default FlightPoints
