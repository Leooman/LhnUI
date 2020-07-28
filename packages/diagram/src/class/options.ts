import config from '../utils/config'
import { Data } from './data'
export type Options = {
  grid?: boolean
  font?: {
    color?: string
    fontFamily?: string
    fontSize?: number
    lineHeight?: number
    textAlign?: string
    textBaseline?: string
  }
  data?: Data
}

export const DefalutOptions = {
  grid: true,
  font: {
    color: config.fontColor,
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    lineHeight: config.lineHeight,
    textAlign: config.textAlign,
    textBaseline: config.textBaseline,
  },
}
