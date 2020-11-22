import React, {useContext, useEffect, useState} from 'react';
import { Flex, Image, Text} from 'rebass';
import ReactPlayer from 'react-player'
import { useWindowSize} from '@react-hook/window-size'
import getPixels from "get-pixels"
import { DataContext, SetDarkContext } from '../Context'
import SketchFabViewer from './SketchFabViewer';
import Lightbox from './ImageViewer'

const Viewer = ({id, auto, dark}) => {
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setDark = useContext(SetDarkContext)
  const specimen = data.find(datum => datum.uid === id)
  const [preview, setPreview] = useState(null)
  const [load, setLoad] = useState(auto ? true : false)
  const [hover, setHover] = useState(false)

  useEffect(()=>{
    setLoad(auto)
  },[auto, specimen])

  useEffect(()=>{
    if (specimen.type === 'Model'){
      fetch("https://api.sketchfab.com/v3/models/"+specimen.url.split("-").slice(-1))
      .then(res => res.json())
      .then(body => body.thumbnails.images.find(item=>item.width>=0.5*width && item.width<=2*width))
      .then(image => setPreview(image.url))
      .catch(console.log)}
  },[specimen])

  useEffect(()=>{
    if (preview) {
      const pixels = getPixels(preview, function(err, pixels) {
        if(err) {
          console.log("Bad image path")
          return
        }
        const [rgb, alpha] = getPixelAverage(pixels.data)
        setDark(alpha < 200 ? false : rgb > 100 ? false : true)
      })
    }
  },[preview])

  const getPixelAverage = (arr) => {
    const reds = []
    const greens = []
    const blues = []
    const alphas = []
    for (let i = 0; i < arr.length; i += 4) {
      reds.push(arr[i + 0])
      greens.push(arr[i + 1])
      blues.push(arr[i + 2])
      alphas.push(arr[i + 3])
    }
    const redSum = reds.reduce((acc, curr) => acc + curr, 0);
    const greenSum = greens.reduce((acc, curr) => acc + curr, 0);
    const blueSum = blues.reduce((acc, curr) => acc + curr, 0);
    const alphaSum = alphas.reduce((acc, curr) => acc + curr, 0);
    const rgb = (redSum+greenSum+blueSum)/(3*reds.length)
    const alpha = alphaSum/alphas.length
    return [rgb, alpha]
  }

  return(
  <Flex sx={{bg:'transparent', height:'100%',width:'100%', flexDirection:'column', justifyContent:'flex-start'}}>
      {specimen.type === "Model" && load &&
        <SketchFabViewer url={specimen.url}/>
      }
      {specimen.type === "Model" && !load &&
        // <Flex sx={{flexDirection:'column', justifyContent:'flex-end',alignItems:'center',height:'75vmin'}}>
        //   <Image
        //     sx={{
        //       backgroundColor:"black",
        //       borderRadius:"1.5vmin",
        //       width:width/2.5,
        //       boxShadow:"0px 3px 8px #A9A9A9",
        //       cursor:'pointer',
        //       ':hover':{
        //         boxShadow:'0px 6px 16px #1ea9d7'
        //       }
        //     }}
        //     src={preview}
        //     onMouseEnter={()=>{setHover(true)}}
        //     onMouseLeave={()=>{setHover(false)}}
        //     onClick={()=>{setLoad(true)}}
        //     />
        //   <Text
        //     sx={{
        //       visibility: hover ? 'visible' : 'hidden',
        //       mt:'2vmin',
        //       fontFamily:'body',
        //       fontSize:'miniscule',
        //       textTransform:'uppercase',
        //       letterSpacing:'0.2vmin',
        //       color:'azure',
        //     }}>
        //     Click to load
        //   </Text>
        // </Flex>
        <Flex sx={{flexDirection:'column', justifyContent:'center',alignItems:'center',height:'100%', width:'100%'}}>
          <Image
            sx={{
              backgroundColor:"transparent",
              position:'absolute',
              width:'100%',
              cursor:'pointer',
              ':hover':{
                mixBlendMode:'overlay',
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
              fontFamily:'body',
              fontSize:'miniscule',
              fontWeight:'600',
              textTransform:'uppercase',
              letterSpacing:'0.25vmin',
              color: dark ? 'clay' : 'dusty',
              zIndex:'10',
            }}>
            Click to load
          </Text>
        </Flex>
      }
      {specimen.type === "Video" &&
        <ReactPlayer url={specimen.url} playing loop/>
      }
      {specimen.type === "Image" &&
        <Lightbox src={specimen.url} alt={specimen.scientific}/>
      }
    </Flex>
  )
}

export default Viewer
