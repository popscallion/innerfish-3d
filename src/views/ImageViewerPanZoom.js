import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from '@emotion/styled'
import { useTheme } from 'emotion-theming'
import {Box, Flex, Image, Button} from 'rebass';
import {ReactComponent as SvgIn} from '../assets/in.svg'
import {ReactComponent as SvgOut} from '../assets/out.svg'
import {ReactComponent as SvgReset} from '../assets/reset.svg'

const ImageViewer = ({dark,...props}) => {
  const theme = useTheme()
  return (
    <TransformWrapper
      options={{minScale:0.5}}
      defaultScale={1}
      doubleClick={{mode:'reset'}}
      zoomIn={{step:10}}
      zoomOut={{step:10}}
      wheel={{disabled:true}}
      pinch={{disabled:true}}
      >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Flex sx={{
            flexDirection:'row',
            justifyContent:'center',
            position:'absolute',
            zIndex:10,
            ml:'auto',
            mr:'auto',
            mt:'1vmin',
            left:0,
            right:0,
          }}>
            <Button sx={{
              cursor: 'pointer',
              border: 'none',
              bg: 'transparent',
              p: 1,
              m: 2,
            }} onClick={zoomIn}>
              <SvgIn fill={dark ? theme.colors.light : theme.colors.dark} width='1.5vmin' height='1.5vmin'/>
            </Button>
            <Button sx={{
              cursor: 'pointer',
              border: 'none',
              bg: 'transparent',
              p: 1,
              m: 2,
            }} onClick={zoomOut}>
              <SvgOut fill={dark ? theme.colors.light : theme.colors.dark} width='1.5vmin' height='1.5vmin'/>
            </Button>
            <Button sx={{
              cursor: 'pointer',
              border: 'none',
              bg: 'transparent',
              p: 1,
              m: 2,
            }} onClick={resetTransform}>
              <SvgReset fill={dark ? theme.colors.light : theme.colors.dark} width='1.5vmin' height='1.5vmin'/>
            </Button>
          </Flex>
          <TransformComponent>
            <Image
              src={props.src}
              alt={props.alt}
              sx={{width:'100vw', height:'auto'}}
              />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  )
}


export default ImageViewer
