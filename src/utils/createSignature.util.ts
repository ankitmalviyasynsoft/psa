import { createHmac } from 'crypto'

export function validatePayloadSignature(payload: any) {
  const payloadSecretKey = process.env.NEXT_PUBLIC_PAYLOAD_SECRET_KEY || ''

  const computedSignature = createHmac('sha256', payloadSecretKey).update(JSON.stringify(payload)).digest('hex')
  return computedSignature
}
