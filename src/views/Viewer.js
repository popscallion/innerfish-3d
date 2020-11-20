import React, {useContext, useEffect, useState} from 'react';
import {Box, Flex, Image, Text} from 'rebass';
import ReactPlayer from 'react-player'
import { DataContext, IdContext } from '../Context'
import SketchFabViewer from './SketchFabViewer';
import Lightbox from './ImageViewer'

const Viewer = (props) => {
  const width = window.innerWidth
  const data = useContext(DataContext)
  const specimenId = useContext(IdContext)
  const specimen = data.find(datum => datum.scientific == specimenId)
  const [preview, setPreview] = useState(null)
  const [load, setLoad] = useState(props.auto ? true : false)
  const [hover, setHover] = useState(false)

  useEffect(()=>{
    setLoad(props.auto)
  },[props.auto, specimen])

  if (!load) {
    fetch("https://api.sketchfab.com/v3/models/"+specimen.url.split("-").slice(-1))
      .then(res => res.json())
      .then(body => body.thumbnails.images.find(item=>item.width>=0.5*width && item.width<=2*width))
      .then(image => setPreview(image.url))
      .catch(console.log)
  }

  return(
  <Flex sx={{bg:'transparent', height:'100%',width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
      {specimen.type == "Model" && load &&
        <SketchFabViewer url={specimen.url}/>
      }
      {specimen.type == "Model" && !load &&
        <Flex sx={{flexDirection:'column', justifyContent:'center',alignItems:'center',height:'75vmin'}}>
          <Image
            sx={{
              backgroundColor:"red",
              borderRadius:"1.5vmin",
              width:width/2.5,
              boxShadow:"0px 3px 8px #A9A9A9",
              cursor:'pointer',
              ':hover':{
                boxShadow:'0px 6px 16px #1ea9d7'
              }
            }}
            src={preview}
            onMouseEnter={()=>{setHover(true)}}
            onMouseLeave={()=>{setHover(false)}}
            onClick={()=>{setLoad(true)}}
            />
          <Text
            sx={{
              visibility: hover ? 'visible' : 'hidden',
              mt:'2vmin',
              fontFamily:'body',
              fontSize:'miniscule',
              textTransform:'uppercase',
              letterSpacing:'0.2vmin',
              color:'azure',
            }}>
            Click to load
          </Text>
        </Flex>
      }
      {specimen.type == "Video" &&
        <ReactPlayer url={specimen.url} playing loop/>
      }
      {specimen.type == "Image" &&
        <Lightbox src={specimen.url} alt={specimen.scientific}/>
      }
    </Flex>
  )
}

export default Viewer
