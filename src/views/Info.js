import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import { DataContext, IdContext } from '../Context'


const Info = () => {
  const data = useContext(DataContext)
  const specimenId = useContext(IdContext)
  const specimen = data.find(datum => datum.scientific == specimenId)
  return(
    <Box sx={{bg:'transparent', height:'fit-content',width:'20vw', pointerEvents:'all',alignSelf:'flex-end'}}>
      {specimen.scientific &&
        <Heading sx={{
          fontSize:'medium',
          fontStyle:'italic',
          lineHeight:'1.1',
          mb: '1vmin'
        }}>{specimen.scientific}</Heading>
      }
      {specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'small',
          mb: '1vmin',
        }}>{specimen.common}</Heading>
      }
      {!specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'medium',
          lineHeight:'1.1',
          mb: '1vmin',
        }}>{specimen.common}</Heading>
      }
      <Text sx={{
        fontFamily:'body',
        fontSize:'miniscule'
      }}>{specimen.caption}</Text>
    </Box>
  )
}

export default Info
