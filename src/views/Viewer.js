import React, {useContext, useEffect, useState} from 'react';
import { Box, Flex, Image, Text} from 'rebass';
import ReactPlayer from 'react-player'
import { useWindowSize} from '@react-hook/window-size'
import getPixels from "get-pixels"
import { DataContext, SetDarkContext } from '../Context'
import SketchFabViewer from './SketchFabViewer';
import ImageViewer from './ImageViewer'

const Viewer = ({id, auto, dark, setAttribution, setBacker, expand}) => {
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setDark = useContext(SetDarkContext)
  const specimen = data.find(datum => datum.uid === id)
  const [meta, setMeta] = useState(null)
  const [image, setImage] = useState(null)
  const [load, setLoad] = useState(auto ? true : false)

  useEffect(()=>{
    setLoad(auto)
  },[auto, specimen])

  useEffect(()=>{
    setAttribution(null)
    if (specimen.type === 'Model'){
      fetch("https://api.sketchfab.com/v3/models/"+specimen.url.split("-").slice(-1))
      .then(res => res.json())
      .then(body => setMeta(body))
      .catch(console.log)}
    else if (specimen.type === 'Image'){
      setImage(specimen.url)
    }
    else if (specimen.type === 'Video'){
      setBacker(1)
      setImage(null)
      setDark(true)
      if (auto) {
        const timer = setTimeout(() => setBacker(2), 5000);
        return () => clearTimeout(timer);
      }
    }
  },[specimen])

  useEffect(()=>{
    if (meta){
      const preview = meta.thumbnails.images.find(item=>item.width>=0.5*width && item.width<=2*width).url
      const user = meta.user.displayName
      setImage(preview)
      setAttribution(user)
    }
  },[meta])

  useEffect(()=>{
    if (image) {
      const pixels = getPixels(image, function(err, pixels) {
        if(err) {
          console.log("Bad image path")
          return
        }
        const [rgb, alpha] = getPixelAverage(pixels.data)
        setDark(alpha < 200 ? false : rgb > 100 ? false : true)
      })
    }
  },[image])

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
        <Flex sx={{flexDirection:'column', justifyContent:'center',alignItems:'center',height:'100%', width:'100%'}}>
          <Image
            sx={{
              backgroundColor:"transparent",
              position:'absolute',
              width:'100%',
              height:'100%',
              objectFit:'cover',
            }}
            src={image}
            />
          <Box
            sx={{
              width:'0',
              height:'0',
              cursor:'pointer',
              borderTop:'3vmin solid transparent',
              borderBottom:'3vmin solid transparent',
              borderLeft:'4.5vmin solid',
              borderLeftColor: dark ? 'ochre' : 'amber',
              mixBlendMode:'luminosity',
              opacity:'0.7',
              zIndex:'10',
              ':hover':{
                mixBlendMode:'normal',
              }
            }}
            onClick={()=>{setLoad(true)}}/>
        </Flex>
      }
      {specimen.type === "Video" &&
        <Flex sx={{width:'100%', height:'100%', flexDirection:'column', justifyContent:'center', bg:'black'}}>
          <Box sx={{width:width, height:'60%'}}>
            <ReactPlayer url={specimen.url} width='100%' height='100%' playing={auto ? true : false}/>
          </Box>
        </Flex>
      }
      {specimen.type === "Image" && image &&
        <ImageViewer src={image} alt={specimen.scientific} dark={dark}/>
      }

      <Box sx={{bg: dark ? 'dark' : 'light', opacity: expand ? 0.95 : 0, height:'100%',width:'100%', position:'absolute', transition:'all 0.4s', pointerEvents: expand ? 'all' : 'none'}}/>

    </Flex>
  )
}

export default Viewer
