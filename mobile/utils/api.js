// When running in Expo Web, the browser treats localhost as the host machine.
// For iOS Simulator, swap this to your machine's local IP (e.g. http://192.168.x.x:3000).
const API_URL = 'http://localhost:3000'

export async function getReadings() {
  const res = await fetch(`${API_URL}/api/readings`)
  return res.json()
}

export async function createReading(systolic, diastolic, pulse) {
  const res = await fetch(`${API_URL}/api/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: Number(pulse),
    }),
  })
  return res.json()
}
