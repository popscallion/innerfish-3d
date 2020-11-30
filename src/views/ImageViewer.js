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
    <Flex sx={{width:'100%', height:'100%', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Image
          src={props.src}
          alt={props.alt}
          sx={{maxWidth:'80%', maxHeight:'60%', width:'auto', objectFit:'contain',border:'0.5vmin solid', borderColor: dark ? 'light' : 'dark'}}
          />
    </Flex>
  )
}


export default ImageViewer
