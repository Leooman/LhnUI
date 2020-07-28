import { Point } from '../class'
export function pointInRect(point: Point, vertices: Point[]): boolean {
  if (vertices.length < 3) {
    return false
  }
  let isIn = false

  let last = vertices[vertices.length - 1]
  for (const item of vertices) {
    if (
      (item.y < point.y && last.y >= point.y) ||
      (item.y >= point.y && last.y < point.y)
    ) {
      if (
        item.x + ((point.y - item.y) * (last.x - item.x)) / (last.y - item.y) >
        point.x
      ) {
        isIn = !isIn
      }
    }

    last = item
  }

  return isIn
}
export function pointInLine(point: Point, from: Point, to: Point): boolean {
  const points: Point[] = [
    new Point(from.x - 8, from.y - 8),
    new Point(to.x - 8, to.y - 8),
    new Point(to.x + 8, to.y + 8),
    new Point(from.x + 8, from.y + 8),
  ]

  return pointInRect(point, points)
}

function S4(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function uuid(): string {
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}
