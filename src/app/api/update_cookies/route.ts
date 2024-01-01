import { spawn } from "child_process"
import { chromium } from "playwright"
import { writeFile } from "fs/promises"

const args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--password-store=basic",
  "---use-gl=egl",
  "--use-mock-keychain",
  "--disable-accelerated-2d-canvas"
]

export async function POST() {
  const chromeProcess = spawn("chromium-browser", [...args, "--remote-debugging-port=9222"])

  await new Promise(resolve => setTimeout(resolve, 2000))

  const today = new Date()
  const todayString = today.toISOString().split("T")[0]
  const futureString = new Date(today.setDate(today.getDate() + 6)).toISOString().split("T")[0]

  const browser = await chromium.connectOverCDP({
    endpointURL: "http://localhost:9222",
    slowMo: 50
  })

  const page = await browser.newPage()

  await page.goto(`https://interline.tudoazul.com/flights/RT/GRU/MCO/-/-/${todayString}/${futureString}/1/0/0/0/0/ALL/F/ECONOMY/-/-/-/-/A/-`)

  let cookies = await page.context().cookies()
  cookies = cookies.filter(cookie => cookie.domain.endsWith(".tudoazul.com"))
  const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(";")

  await browser.close()

  chromeProcess.kill()

  await writeFile("cookies.txt", cookieString)

  return new Response(cookieString)
}
