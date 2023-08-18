import { createTextColumn } from './textColumn'

function parseNumber(input: string): number | null {
  const numero = input.replaceAll('.', '').replace(',', '.')

  const parsedNumber = parseFloat(numero)
  if (isNaN(parsedNumber)) {
    return null
  }

  return parsedNumber
}

export const floatColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) =>
    typeof value === 'number'
      ? new Intl.NumberFormat('pt-BR').format(value)
      : '',
  parseUserInput: (value) => {
    const number = parseNumber(value) || 0
    return !isNaN(number) ? number : null
  },
  parsePastedValue: (value) => {
    const number = parseNumber(value) || 0
    return !isNaN(number) ? number : null
  },
})
