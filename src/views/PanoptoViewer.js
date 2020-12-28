import React, {useEffect, useRef} from 'react';
import { useWindowSize} from '@react-hook/window-size'
import styled from '@emotion/styled'
import { Box } from 'rebass'
import Iframe from 'react-iframe'

const Viewer = (props) => {
  const options = {
    autoplay: true,
    showbrand: false,
    offerviewer: false,
    showtitle: false,
    interactivity: "none",
  }
  const [width, height] = useWindowSize()
  const url = props.url.split("&",1)[0]
  const arrayOptions = Object.keys(options).map((item,i)=> item+'='+Object.values(options)[i])
  const newUrl = [url,arrayOptions].flat().join('&')

  return (
      <Box sx={{
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}>
          <Box sx={{  position: 'relative', top: '-10vh', left: '0', width: '100vw', height: '120vh', border: '0'}}>
            <Iframe
              url={newUrl}
              width="106%"
              height="100%"
              allowfullscreen
              allow="autoplay"/>
          </Box>
      </Box>
  );
}


export default Viewer;
