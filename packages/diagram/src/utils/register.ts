import { Line, Point } from '../class'
import {
  polyline,
  calcPolylineControlPoints,
  polylineEndPoints,
  pointInPolyline,
} from '../models/line/polyline'
import {
  triangleSolid,
  triangle as arrowTriangle,
} from '../models/arrow/triangle'
// Functions of drawing a line.
export const drawLineFns: any = {}
// Functions of drawing a arrow.
export const drawArrowFns: any = {}
register()
function register() {
  // ********Default lines.*******
  drawLineFns.polyline = {
    drawFn: polyline,
    controlPointsFn: calcPolylineControlPoints,
    drawEndPointsFn: polylineEndPoints,
    pointIn: pointInPolyline,
  }
  // ********end********
  // ********Default arrows.*******
  drawArrowFns.triangleSolid = triangleSolid
  drawArrowFns.triangle = arrowTriangle
  // ********end********
}

// registerLine: Register a custom line.
// name - The name of line.
// drawFn - How to draw.
// drawControlPointsFn - Draw the control points.
// controlPointsFn - How to get the controlPoints.
// dockControlPointFn - Dock a point to horizontal/vertial or related position.
// force - Overwirte the node if exists.
export function registerLine(
  name: string,
  drawFn: (ctx: CanvasRenderingContext2D, line: Line) => void,
  drawControlPointsFn?: (ctx: CanvasRenderingContext2D, line: Line) => void,
  controlPointsFn?: (line: Line) => void,
  dockControlPointFn?: (point: Point, line: Line) => void,
  pointInFn?: (point: Point, line: Line) => boolean,
  force?: boolean
) {
  if (drawLineFns[name] && !force) {
    return false
  }

  drawLineFns[name] = {
    drawFn,
    drawControlPointsFn,
    controlPointsFn,
    dockControlPointFn,
    pointIn: pointInFn,
  }
  return true
}

// registerArrow: Register a custom arrow.
// name - the name of arrow.
// drawFn - how to draw.
// force - Overwirte the node if exists.
export function registerArrow(
  name: string,
  drawFn: (
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    size: number
  ) => void,
  force?: boolean
) {
  if (drawArrowFns[name] && !force) {
    return false
  }

  drawArrowFns[name] = drawFn
  return true
}
