import React, {useContext} from 'react';
import {Box, Flex, Image} from 'rebass';
import ReactPlayer from 'react-player'
import { DataContext, IdContext } from '../Context'
import SketchFabViewer from './SketchFabViewer';
import Lightbox from './ImageViewer'

const Viewer = () => {
  const data = useContext(DataContext)
  const specimenId = useContext(IdContext)
  const specimen = data.find(datum => datum.scientific == specimenId)
  console.log(specimen);
  return(
    <Box sx={{bg:'pink', height:'100%',width:'100%'}}>
      {specimen.type == "Model" &&
        <SketchFabViewer url={specimen.url}/>
      }
      {specimen.type == "Video" &&
        <ReactPlayer url={specimen.url} playing loop/>
      }
      {specimen.type == "Image" &&
        <Lightbox src={specimen.url} alt={specimen.scientific}/>
      }
    </Box>
  )
}

export default Viewer
