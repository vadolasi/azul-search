import { NextPage } from "next"
import { readFile } from "fs/promises"

interface SearchProps {
  from: string
  to: string
  adult: string
  child: string
  infant: string
  cabin: string
  tripType: string
  flightType: string
  companies: string
  derpatureDateTime: string
  returnDateTime: string
}

const Page: NextPage<{ searchParams: SearchProps }> = async ({
  searchParams: {
    from,
    to,
    adult,
    child,
    infant,
    cabin,
    tripType,
    flightType,
    companies,
    derpatureDateTime,
    returnDateTime
  }
}) => {
  const url = new URL("https://interline.tudoazul.com/catalog/api/v1/availability")
  url.searchParams.set("tripType", tripType)
  url.searchParams.set("origin", from)
  url.searchParams.set("destination", to)
  url.searchParams.set("adult", adult)
  url.searchParams.set("child", child)
  url.searchParams.set("infant", infant)
  url.searchParams.set("cabinCategory", cabin)
  url.searchParams.set("typeOfFlight", flightType)
  url.searchParams.set("companiesIdentity", companies)
  url.searchParams.set("departureDateTime", derpatureDateTime)
  url.searchParams.set("returnDateTime", returnDateTime)

  const cookies = await readFile("./cookies.txt", "utf-8")

  const response = await fetch(url.toString(), {
    "headers": {
      "user-agent":
        "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
      "cookie": cookies
    },
    "referrerPolicy": "strict-origin-when-cross-origin"
  })

  let data = await response.json()

  let flights = data?.departureFlights?.flights as unknown as {
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
  }[]

  const returnFlights = await Promise.all(flights.map(async flight => {
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

    return {
      ...flight,
      points: data.value as number
    }
  }))

  return (
    <div>
      {returnFlights.map(flight => (
        <div key={flight.id}>
          <div className="flex items-center justify-center gap-4">
            <span>{flight.originAirportName}</span>
            <span>→</span>
            <span>{flight.finalDestinationName}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>{flight.points}</span>
            <span>pontos</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
