import React, {useContext} from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { DataContext, IdContext } from '../Context'


const Tree = () => {
  const data = useContext(DataContext)
  const specimenId = useContext(IdContext)
  const specimen = data.find(datum => datum.scientific == specimenId)
  const nodesToDraw = 'x'
  return (
    <Stage width={window.innerWidth} height={window.innerHeight*0.25}>
        <Layer>
          <Text text="Try click on rect" />
        </Layer>
      </Stage>
  )
}

export default Tree
