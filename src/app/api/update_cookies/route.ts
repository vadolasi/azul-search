import { firefox } from "playwright"
import { writeFile } from "fs/promises"

export async function POST() {
  const browser = await firefox.launch({ headless: true })

  const page = await browser.newPage()

  await page.goto("https://interline.tudoazul.com/")

  const cookies = await page.context().cookies()
  const cookieString = cookies
    .filter(cookie => cookie.domain.endsWith(".tudoazul.com"))
    .map(cookie => `${cookie.name}=${cookie.value}`).join(";")

  await browser.close()

  await writeFile("cookies.txt", cookieString)

  return new Response(cookieString)
}
