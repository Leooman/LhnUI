export function rgbToHex(r:number, g:number, b:number) {
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex
}

export function hexToRgb(hex:string) {
  const rgb = []
  for (var i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)))
  }
  return rgb
}

export function gradient(startColor:string, endColor:string, step:number) {
  let sColor = hexToRgb(startColor)
  let eColor = hexToRgb(endColor)

  let rStep = (eColor[0] - sColor[0]) / step
  let gStep = (eColor[1] - sColor[1]) / step
  let bStep = (eColor[2] - sColor[2]) / step

  const gradientColorArr = []
  for (var i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(
        parseInt(String(rStep * i + sColor[0])),
        parseInt(String(gStep * i + sColor[1])),
        parseInt(String(bStep * i + sColor[2]))
      )
    )
  }
  return gradientColorArr
}

export function judgeIntersect(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number) {
  if (
    !(
      Math.min(x1, x2) <= Math.max(x3, x4) &&
      Math.min(y3, y4) <= Math.max(y1, y2) &&
      Math.min(x3, x4) <= Math.max(x1, x2) &&
      Math.min(y1, y2) <= Math.max(y3, y4)
    )
  )
    return false
  var u, v, w, z
  u = (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1)
  v = (x4 - x1) * (y2 - y1) - (x2 - x1) * (y4 - y1)
  w = (x1 - x3) * (y4 - y3) - (x4 - x3) * (y1 - y3)
  z = (x2 - x3) * (y4 - y3) - (x4 - x3) * (y2 - y3)
  return u * v <= 0.00000001 && w * z <= 0.00000001
}