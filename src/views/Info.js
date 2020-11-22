import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import { DataContext} from '../Context'


const Info = ({id, dark}) => {
  const data = useContext(DataContext)
  const specimen = data.find(datum => datum.uid === id)
  return(
    <Box sx={{bg:'transparent', height:'fit-content',width:'20vw', pointerEvents:'all',alignSelf:'flex-end'}}>
      {specimen.scientific &&
        <Heading sx={{
          fontSize:'medium',
          fontStyle:'italic',
          lineHeight:'1.1',
          mb: '1vmin',
          color: dark ? 'light' : 'dark',
        }}>{specimen.scientific}</Heading>
      }
      {specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'small',
          mb: '1vmin',
          color: dark ? 'light' : 'dark'
        }}>{specimen.common}</Heading>
      }
      {!specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'medium',
          lineHeight:'1.1',
          mb: '1vmin',
          color: dark ? 'light' : 'dark'
        }}>{specimen.common}</Heading>
      }
      <Text sx={{
        fontFamily:'body',
        fontSize:'teensy',
        lineHeight:'1.65',
        mt: '2vmin',
        color: dark ? 'light' : 'dark'
      }}>{specimen.caption}</Text>
    </Box>
  )
}

export default Info
