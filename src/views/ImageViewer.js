import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {Box, Flex, Image, Button} from 'rebass';
import svgIn from '../assets/in.svg'
import svgOut from '../assets/out.svg'
import svgReset from '../assets/reset.svg'


const Lightbox = props =>
  <TransformWrapper
    options={{minScale:0.5}}
    defaultScale={0.75}
    doubleClick={{mode:'reset'}}
    zoomIn={{step:10}}
    zoomOut={{step:10}}
    wheel={{disabled:true}}
    pinch={{disabled:true}}
    >
    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
      <>
        <Flex sx={{
          flexDirection:'row'
        }}>
          <Button sx={{
            cursor: 'pointer',
            border: 'none',
            bg: 'transparent',
            p: 1,
            m: 2,
          }} onClick={zoomIn}>
            <Image src={svgIn} sx={{width: 16, height:16}}/>
          </Button>
          <Button sx={{
            cursor: 'pointer',
            border: 'none',
            bg: 'transparent',
            p: 1,
            m: 2,
          }} onClick={zoomOut}>
            <Image src={svgOut} sx={{width: 16, height:16}}/>
          </Button>
          <Button sx={{
            cursor: 'pointer',
            border: 'none',
            bg: 'transparent',
            p: 1,
            m: 2,
          }} onClick={resetTransform}>
            <Image src={svgReset} sx={{width: 16, height:16}}/>
          </Button>
        </Flex>
        <TransformComponent>
          <Image
            src={props.src}
            alt={props.alt}
            sx={{maxWidth:'100%', width:'100%', height:'100%'}}
            />
        </TransformComponent>
      </>
    )}
  </TransformWrapper>

export default Lightbox
