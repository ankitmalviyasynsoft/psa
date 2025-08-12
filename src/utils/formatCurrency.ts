import { formatNumber } from './number.util'

export const formatCurrency = (price: number, code: string) => `${formatNumber(price)} ${code}`
