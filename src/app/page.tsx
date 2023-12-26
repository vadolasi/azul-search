"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import useSWR from "swr"

const schema = z.object({
  origem: z.object({
    code: z.string(),
    name: z.string()
  }),
  destino: z.object({
    code: z.string(),
    name: z.string()
  }),
  dataSaida: z.date().refine(value => {
    const data = new Date(value)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return data >= hoje
  }, "A data de saída deve ser maior ou igual a data atual"),
  dataRetorno: z.date().refine(value => {
    const data = new Date(value)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return data >= hoje
  }, "A data de retorno deve ser maior ou igual a data atual").optional(),
  adultos: z.number().int().min(1).max(9),
  criancas: z.number().int().min(0).max(9),
  bebes: z.number().int().min(0).max(9),
  onlyDirect: z.boolean().optional(),
  onlyOneWay: z.boolean().optional(),
  cabinCategory: z.enum(["ECONOMY", "BUSINESS"]).default("ECONOMY")
})
  .refine(value => {
    if (!value.dataRetorno) {
      return true
    }

    const dataSaida = new Date(value.dataSaida)
    const dataRetorno = new Date(value.dataRetorno)
    return dataSaida <= dataRetorno
  }, "A data de retorno deve ser maior ou igual a data de saída")

type FormValues = z.infer<typeof schema>

export default function Home() {
  const [origensOpen, setOrigensOpen] = useState(false)
  const [destinosOpen, setDestinosOpen] = useState(false)
  const [lastDestino, setLastDestino] = useState<string | null>(null)
  const [lastOrigem, setLastOrigem] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      origem: {
        code: "",
        name: ""
      },
      destino: {
        code: "",
        name: ""
      },
      adultos: 1,
      criancas: 0,
      bebes: 0,
      dataSaida: new Date()
    }
  })

  const router = useRouter()

  const onSubmit = handleSubmit(data => {
    const searchParams = new URLSearchParams()
    searchParams.set("tripType", data.onlyOneWay ? "ONE_WAY" : "ROUND_TRIP")
    searchParams.set("from", data.origem.code)
    searchParams.set("to", data.destino.code)
    searchParams.set("adult", data.adultos.toString())
    searchParams.set("child", data.criancas.toString())
    searchParams.set("infant", data.bebes.toString())
    searchParams.set("cabin", data.cabinCategory)
    searchParams.set("flightType", data.onlyDirect ? "DIRECT" : "ALL")
    searchParams.set("companies", "-")
    searchParams.set("derpatureDateTime", data.dataSaida.toISOString())
    if (data.dataRetorno) {
      searchParams.set("returnDateTime", data.dataRetorno.toISOString())
    }

    router.push(`/search?${searchParams.toString()}`)
  })

  const origem = watch("origem.name")
  const origemCode = watch("origem.code")
  const destino = watch("destino.name")
  const dataSaida = watch("dataSaida")
  const onlyOneWay = watch("onlyOneWay")

  const { data: origens } = useSWR<{ code: string, name: string }[]>(
    () => {
      if (origem.length >= 3 && origem !== lastOrigem) {
        return `https://interline.tudoazul.com/catalog/api/v1/airport?searchAirport=${origem}`
      }

      return null
    },
    url => fetch(url).then(res => res.json()),
    {
      onSuccess: () => {
        setOrigensOpen(true)
      }
    }
  )

  const { data: destinos } = useSWR<{ code: string, name: string }[]>(
    () => {
      if (origemCode && destino.length >= 3 && destino !== lastDestino) {
        return `https://interline.tudoazul.com/catalog/api/v1/airport?searchAirport=${destino}&originAirportCode=${origemCode}`
      }

      return null
    },
    url => fetch(url).then(res => res.json()),
    {
      onSuccess: () => {
        setDestinosOpen(true)
      }
    }
  )

  return (
    <div className="flex gap-4 items-center justify-center w-full min-h-screen">
      <form className="flex flex-col gap-8 w-1/2" onSubmit={onSubmit}>
        <label htmlFor="input_onlyOneWay">
          <input id="input_onlyOneWay" type="checkbox" className="mr-2" {...register("onlyOneWay")} />
          Somente ida
        </label>
        <div className="flex gap-4">
          <div className="relative w-full">
            <label htmlFor="input_origem">Origem</label>
            <input id="input_origem" type="text" className="p-2 border bg-white rounded w-full" {...register("origem.name")} />

            {origensOpen && (
              <ul className="absolute rounded border shadow mt-1 max-h-48 overflow-auto z-50 w-full bg-white">
                {origens?.map(origem => (
                  <li key={origem.code}>
                    <button
                      onClick={() => {
                        setValue("origem.name", origem.name)
                        setValue("origem.code", origem.code)
                        setLastOrigem(origem.name)
                        setOrigensOpen(false)
                      }}
                      className="p-1 rounded hover:bg-gray-100 w-full text-left text-sm"
                    >
                      {origem.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-full">
            <label htmlFor="input_destino">Destino</label>
            <input id="input_destino" type="text" className="p-2 border bg-white rounded w-full" {...register("destino.name")} />

            {destinosOpen && (
              <ul className="absolute rounded border shadow mt-1 max-h-48 overflow-auto z-50 w-full bg-white">
                {destinos?.map(destino => (
                  <li key={destino.code}>
                    <button
                      onClick={() => {
                        setValue("destino.name", destino.name)
                        setValue("destino.code", destino.code)
                        setLastDestino(destino.name)
                        setDestinosOpen(false)
                      }}
                      className="p-1 rounded hover:bg-gray-100 w-full text-left text-sm"
                    >
                      {destino.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="input_data_saida">Data de saída</label>
            <input
              id="input_data_saida"
              type="date"
              className="p-2 border bg-white rounded"
              {...register("dataSaida", { valueAsDate: true })} min={new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
            />
          </div>
          <div className="flex flex-col w-full">
            {!onlyOneWay && (
              <>
                <label htmlFor="input_data_retorno">Data de retorno</label>
                <input
                  id="input_data_retorno"
                  type="date"
                  className="p-2 border bg-white rounded disabled:opacity-50"
                  {...register("dataRetorno", { valueAsDate: true })}
                  disabled={!dataSaida}
                  min={dataSaida ? dataSaida.toISOString().split("T")[0] : ""}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="input_adultos">Adultos</label>
            <input id="input_adultos" type="number" className="p-2 border bg-white rounded" {...register("adultos")} min={1} max={9} step={1} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="input_criancas">Crianças</label>
            <input id="input_criancas" type="number" className="p-2 border bg-white rounded" {...register("criancas")} min={0} max={9} step={1} />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="input_bebes">Bebês</label>
            <input id="input_bebes" type="number" className="p-2 border bg-white rounded" {...register("bebes")} min={0} max={9} step={1} />
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="input_cabinCategory">Classe</label>
            <select id="input_cabinCategory" className="p-2 border bg-white rounded" {...register("cabinCategory")}>
              <option value="ECONOMY">Econômica</option>
              <option value="BUSINESS">Executiva</option>
            </select>
          </div>
          <label htmlFor="input_onlyDirect" className="w-full flex items-center">
            <input id="input_onlyDirect" type="checkbox" className="mr-2" {...register("onlyDirect")} />
            Somente voos diretos
          </label>
        </div>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Buscar</button>
      </form>
    </div>
  )
}
