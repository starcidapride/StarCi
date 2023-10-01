import { ChartArea } from 'chart.js'

export const createGradient = (
    ctx: CanvasRenderingContext2D,
    area: ChartArea,
    colorStart: string,
    colorEnd: string,
    vertical?: boolean
) : CanvasGradient => {
    console.log(area)
    const gradient = vertical
        ? ctx.createLinearGradient(0, area.bottom, 0, area.top)
        : ctx.createLinearGradient(area.left, 0, area.right, 0)
  
    gradient.addColorStop(0, colorStart)
    gradient.addColorStop(1, colorEnd)

    return gradient
}
  
export const TEAL_50 = 'rgb(240 253 250)'
export const TEAL_100 = 'rgb(204 251 241)'
export const TEAL_200 = 'rgb(153 246 228)'
export const TEAL_300 = 'rgb(94 234 212)'
export const TEAL_400 = 'rgb(45 212 191)'
export const TEAL_500 = 'rgb(20 184 166)'