import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import { DataContext, IdContext } from '../Context'


const Info = () => {
  const data = useContext(DataContext)
  const specimenId = useContext(IdContext)
  const specimen = data.find(datum => datum.scientific == specimenId)
  return(
    <Box sx={{bg:'ochre', height:'100%',width:'100%'}}>
      <Heading sx={{fontFamily:'heading'}}>{specimen.scientific}</Heading>
      {specimen.common &&
        <Heading sx={{}}>{specimen.common}</Heading>
      }
      <Text sx={{}}>{specimen.caption}</Text>
    </Box>
  )
}

export default Info
