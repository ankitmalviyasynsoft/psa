export const formatNumber = (number: string | number) => {
  if (isNaN(number as number)) return number
  return Intl.NumberFormat().format(number as number)
}
