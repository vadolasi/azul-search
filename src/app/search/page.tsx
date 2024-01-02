import { NextPage } from "next"
import { readFile } from "fs/promises"
import FlightPoints from "./_components/FlightPoints"

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

  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id}>
          <div className="flex items-center justify-center gap-4">
            <span>{flight.originAirportName}</span>
            <span>→</span>
            <span>{flight.finalDestinationName}</span>
          </div>
          <FlightPoints flight={flight} cabin={cabin} derpatureDateTime={derpatureDateTime} cookie={cookies} />
        </div>
      ))}
    </div>
  )
}

export default Page
