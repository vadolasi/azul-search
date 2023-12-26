import { NextPage } from "next"
import makeFetchCookie from "fetch-cookie"

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

const fetchCookie = makeFetchCookie(fetch)

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

  await fetchCookie("https://interline.tudoazul.com")

  const response = await fetch("https://interline.tudoazul.com/catalog/api/v1/availability?&tripType=ROUND_TRIP&origin=NAT&destination=VXE&adult=1&child=0&infant=0&typeOfFlight=ALL&companiesIdentity=-&cabinCategory=ECONOMY&departureDateTime=2023-12-30T00:00:00-03:00&returnDateTime=2024-01-03T00:00:00-03:00", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "au_vtid=_1703629788226; _stLang=pt; bm_sz=6BDEF3C48A85BA0262E319E96541CF1C~YAAQqhIuF8HzgmeMAQAAx50/qBaiOBJZVkuCIwsqZ0sURjWtiG2o+8+MxOXHZex3rq+xVnXTeFDbPFy6MouchU56BGQfHsJRwFjXNP0rYI4vjEZV3nMDdFqRVERVVGEExTuShYDrav5Yo/bNzhWYR2YdBIkQtJpHnvgkImNnuCf6GS1D3Vo0hnYX/MO58dzFzGOjeQsnUtGBADrU7gGSsGQfuCr2boizOourpssNf+9PD9HbOjiH+VkqqtK7WQjliDb/ACx7+M76ckqMzSdo6UwlF80XesLeDLeBCchKQz5GnaoqwA==~4277817~4337986; dtSa=true%7CKD%7C-1%7CPage%3A%20%7C-%7C1703629788711%7C228660765_910%7Chttps%3A%2F%2Finterline.tudoazul.com%2Fflights%2FRT%2FNAT%2FVXE%2F-%2F-%2F2023-12-30%2F2024-01-03%2F1%2F0%2F0%2F0%2F0%2FALL%2FF%2FECONOMY%2F-%2F-%2F-%2F-%2FA%2F-%7C%7C%7C%7C; _abck=7C1BC0909A2E00C4ABA18EEE843229A9~-1~YAAQqhIuF9D0gmeMAQAAL6I/qAvimrkn3UJ29x3gbiCTqEc8ZOsn5REB2F1L+VhUXvrv8+PclQQxQqvQ+OvLdnuawEP4DhJOpdiPh6P/BM/hKxfrFaS3Yrz819WcVqEmaJ5Z/kf4O6S6qwfVx1ces7FmuEZ8TxxiJA0H96bTzJZZ0bjaPve+V2Qc2rBc0GbswRgQDqAIDsuZcpBHXCKS4jZ1JRT2Y81qhJJihbdpoI9LrtX6Cn+sbvHEWG+5L/MXCEIPoYXgOkv7juOZZnNdJhvFfAWGk7eceNAFeYlHPAHLwWjBNHVlz3l6YAqgHjyE+98Iv/Ajnb05Vi0W0qXrfraE77tcY/dTe4Eb0IR7RwkiMkKL6MHINeT2r0Z+Z03G9p5XFff85oNzRKIZ~-1~-1~-1; utag_main__sn=1; utag_main__se=1%3Bexp-session; utag_main__ss=1%3Bexp-session; utag_main__st=1703631589491%3Bexp-session; utag_main_ses_id=1703629789491%3Bexp-session; utag_main__pn=1%3Bexp-session; bm_sv=1C307B24F777A233A5B446C6740D4851~YAAQqhIuFxb1gmeMAQAAFKM/qBbTRiWBqUWpQS6YcNHBVoc8xHnb053u5ZaimJfpr7mIkjlset9iS/Rj7fujGgyf9CklOvKF+IvwY6u4bCmnE7lXfzr5Sz0He7KTrOwoxYaDoCVGNb2PJudPtjx7U2vrd8qieiQCryvgsxXrP31TlNIxpjw6XbiDWrusbQkAUqocfb4MC+GNkhJistcDYv4YVLAMlPGT6wggyqpZrQYjj30jJVezYLvuIPkeLMjRquw=~1; ak_bmsc=5CC3128654DB19D5A559AAE69FC84753~000000000000000000000000000000~YAAQqhIuF5j1gmeMAQAAtKQ/qBYHC/VMwxlGGG/DhGa/+fEeMOI3aCfam2GvRrlon+B7xyrNybvU9qGQvH0ILi88JmopBrXNbsnhbpmvLeda95OwMiKpVybc3M8c04LPlyz3sySKZXrAIMqejhxWYKj76A6UFC1cbnfjnBDWBtnkSM5GUtgR0fGa9kfsUkvBtRrpgGPZ0HKTU4Cadl1+YjURiFKO0PQiPjbJiGdvw7/CiQaaadCcj0UawH2kOnzTtCqRXBwckwoRFJr4kctvC8BW4NCussChgZzhmBU/wm/TU38eMxkSFZIl452K0W/CGFIyohB1viJlssDRqnSpZomkel8ajje/TTIYEPZvFnHc43rrtzwTDgLx7UkKlYQMsQWhrrLFH31cWkW5nq/pwaHhckVEl7gxzzPyNqMhCCMIlynX03PpOxhd3rUhJd0cfc5e/RDOZA3OzTgBL12AIosjDtVJjixF9P7yeD4GRsuZ0PYD6LbKAr16xdrthqaYkiA=; utag_main_v_id=018ca83f9bd8001e1074d49a8ad00706f006f06700bd0; utag_main_dc_visit=1; utag_main_dc_event=1%3Bexp-session; cro_test=true; _prevPage=",
      "Referer": "https://interline.tudoazul.com/flights/RT/NAT/VXE/-/-/2023-12-30/2024-01-03/1/0/0/0/0/ALL/F/ECONOMY/-/-/-/-/A/-",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });

  let data = await response.json()

  let flights = data?.departureFlights?.flights as {
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
    const response = await fetchCookie("https://interline.tudoazul.com/exchange/api/v1/exchange/getPoints", {
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
      points: data.points as number
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
            <span>{flight.prices[0].value}</span>
            <span>{flight.points}</span>
            <span>pontos</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Page
