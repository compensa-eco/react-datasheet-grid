import { createTextColumn } from './textColumn'

export const floatColumn = createTextColumn<number | null>({
  alignRight: true,
  formatBlurredInput: (value) =>
    typeof value === 'number'
      ? new Intl.NumberFormat('pt-BR').format(value)
      : '',
  parseUserInput: (value) => {
    const floatNumber = value.replace(',', '.')
    const number = parseFloat(floatNumber)
    return !isNaN(number) ? number : null
  },
  parsePastedValue: (value) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number : null
  },
})
