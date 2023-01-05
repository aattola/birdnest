import axios from 'axios'

export async function getPilot(serialNumber: string) {
  const resp = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`)
  if (resp.status !== 200) throw new Error('Failed to get pilot')

  console.log(resp.data)
  return resp.data
}
