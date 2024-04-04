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

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
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
      const flight = flights[0]

      calendar.push({
        day,
        flight
      })
    } catch (error) {
      console.error(error)
    }
  }))

  return (
    <div className="w-screen min-h-screen flex flex-col gap-2 items-center justify-center p-10 md:p-0">
      <div className="grid grid-cols-7 w-full gap-2 md:w-2/3 lg:w-1/4">
        {new Array(calendar[0].day.getDay() + 1
        ).fill(null).map((_, index) => (
          <div key={index} className="text-center font-bold mt-6 text-sm text-gray-400"></div>
        ))}
        {new Array(calendar[0].day.getDate() - 1).fill(null).map((_, index) => (
          <div key={index} className="text-center font-bold mt-6 text-sm text-gray-400">
            {index + 1}
          </div>
        ))}
        {calendar.map(({ day, flight }) => (
          <div key={day.toString()} className="flex items-center justify-center flex-col">
            <span className="text-center font-bold mt-6 text-sm">{day.getDate()}</span>
            <div className="flex flex-col gap-2">
              <div key={flight.id}>
                <FlightPoints flight={flight} cabin={cabin} derpatureDateTime={derpatureDateTime} />
              </div>
            </div>
          </div>
        ))}
        {(daysInMonth(returnDate.getMonth() + 1, returnDate.getFullYear()) - returnDate.getDate() > 0) && new Array(daysInMonth(returnDate.getMonth() + 1, returnDate.getFullYear()) - returnDate.getDate()).fill(null).map((_, index) => (
          <div key={index} className="text-center font-bold mt-6 text-sm text-gray-400">
            {index + calendar[calendar.length - 1].day.getDate() + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
