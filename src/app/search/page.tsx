import { NextPage } from "next"
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
  const departureDate = new Date(derpatureDateTime)
  const returnDate = new Date(returnDateTime)

  const days = []

  while (departureDate <= returnDate) {
    days.push(new Date(departureDate))
    departureDate.setDate(departureDate.getDate() + 1)
  }

  days.shift()
  days.push(new Date(departureDate))

  const calendar: any[] = []

  await Promise.all(days.map(async day => {
    try {
      const url = new URL("http://interline.tudoazul.com/catalog/api/v1/availability")
      url.searchParams.set("tripType", tripType)
      url.searchParams.set("origin", from)
      url.searchParams.set("destination", to)
      url.searchParams.set("adult", adult)
      url.searchParams.set("child", child)
      url.searchParams.set("infant", infant)
      url.searchParams.set("cabinCategory", cabin)
      url.searchParams.set("typeOfFlight", flightType)
      url.searchParams.set("companiesIdentity", companies)
      url.searchParams.set("departureDateTime", day.toISOString())

      const finalUrl = new URL("http://localhost:8000")
      finalUrl.searchParams.set("url", url.toString())

      const response = await fetch(finalUrl.toString())

      const data = await response.json() as any

      const flights = data?.departureFlights?.flights as unknown as {
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

      flights.sort((a, b) => a.prices[0].value - b.prices[0].value)
      flights.splice(5)

      calendar.push({
        day,
        flights
      })
    } catch (error) {
      console.error(error)
    }
  }))

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center">
      {calendar.map(({ day, flights }) => (
        <div key={day.toString()} className="flex flex-col gap-6">
          <span className="text-center font-bold mt-6">{day.toLocaleDateString("pt-BR")}</span>
          <div className="flex flex-col gap-4">
            {flights.map((flight: any) => (
              <div key={flight.id}>
                <div className="flex items-center justify-center gap-4">
                  <span>{flight.originAirportName}</span>
                  <span>→</span>
                  <span>{flight.finalDestinationName}</span>
                </div>
                <FlightPoints flight={flight} cabin={cabin} derpatureDateTime={derpatureDateTime} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
