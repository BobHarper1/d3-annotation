
import { lineBuilder } from './Builder'
const CLASS = "connector"

export const connectorLine = ({ annotation, offset=annotation.position, context,
    curve, bbox, elbow=false, points }) => {

  let x1 = annotation.x - offset.x,
    x2 = x1 + annotation.dx,
    y1 = annotation.y - offset.y,
    y2 = y1 + annotation.dy

  if (x2 < -bbox.width/2 && !elbow){
    x2 += bbox.width
  }

  const td = annotation.typeData
  if ((td.outerRadius || td.radius) && !elbow){
    const h =  Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2))
    const angle = Math.asin(-y2/h)
    const r = td.outerRadius || td.radius + (td.radiusPadding || 0)

    x1 = Math.abs(Math.cos(angle)*r)*(x2 < 0 ? -1 : 1)
    y1 = Math.abs(Math.sin(angle)*r)*(y2 < 0 ? -1 : 1)

  }

  let data = [[x1, y1], [x2, y2]]

  if (elbow) {
    
    if (x2 < 0 && Math.abs(x2) < bbox.width){
       if ((td.outerRadius || td.radius) ){
        const r = td.outerRadius || td.radius + (td.radiusPadding || 0)
        y1 += r*(y2 < 0 ? -1: 1)
       }
      data = [[x1, y1], [x1, y2]]
    } else {
      let adjustedWidth = false
      if (x2 < -bbox.width){
        x2 += bbox.width
        adjustedWidth = true
      } 

      let diffY = (y2 - y1)
      let diffX = (x2 - x1)
      let xe = x2 
      let ye = y2
      let opposite = (y2 < 0 && x2 > 0 || x2 < 0 && y2 > 0)? -1 : 1

      if (Math.abs(diffX) < Math.abs(diffY)){
        xe = x2
        ye = y1 + diffX*opposite
      } else {
        ye = y2
        xe = x1 + diffY*opposite
      }
      
      if (td.outerRadius || td.radius ){
        const r = td.outerRadius || td.radius + (td.radiusPadding || 0)
        const length = r/Math.sqrt(2)

        if (Math.abs(diffX) > length && Math.abs(diffY) > length){
          x1 = length*(x2 < 0 ? -1 : 1)
          y1 = length*(y2 < 0 ? -1 : 1)
          data = [[x1, y1], [xe , ye ], [x2, y2]]

        } else if (Math.abs(diffX) > Math.abs(diffY)){
          const angle = Math.asin(-y2/r)
          x1 = Math.abs(Math.cos(angle)*r)*(x2 < 0 ? -1 : 1)
          data = [[ x1, y2], [x2, y2]]
        } else {
          const angle = Math.acos(x2/r)
          y1 = Math.abs(Math.sin(angle)*r)*(y2 < 0 ? -1 : 1)
          data = [[ x2, y1], [x2, y2]]
        }
      } else {
        data = [[x1, y1], [xe , ye], [x2, y2]]
      }
    
    } 
  } else if (points) {
    data = [ [x1, y1], ...points, [x2, y2] ] 
  }

  return lineBuilder({ data, curve, context, className : CLASS })
}

export const connectorArrow = ({ annotation, offset=annotation.position, start, end, bbox, context}) => {

  if (!start) { start = [annotation.dx, annotation.dy]} 
  else { start = [-end[0] + start[0], - end[1] + start[1]]}
  if (!end) { end = [annotation.x - offset.x, annotation.y - offset.y]}

  let x1 = end[0],
    y1 = end[1];

  let dx = start[0] 
  let dy = start[1] 

  let size = 10;
  let angleOffset = 16/180*Math.PI
  let angle = Math.atan(dy/dx) 

  if (dx < 0 ) {
    angle += Math.PI
  }

  const data = [[x1, y1], 
    [Math.cos(angle + angleOffset)*size + x1, Math.sin(angle + angleOffset)*size + y1],
    [Math.cos(angle - angleOffset)*size + x1, Math.sin(angle - angleOffset)*size + y1],
    [x1, y1]
    ]

  return lineBuilder({ data, context, className : CLASS + '-arrow' })
}