import React, {useContext} from 'react';
import ReactHtmlParser from 'react-html-parser';
import {Box, Flex, Image, Text, Heading, Link} from 'rebass';
import { useTheme } from 'emotion-theming'
import { DataContext} from '../Context'


const Info = ({id, dark, attribution}) => {
  const theme = useTheme()
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
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{specimen.scientific}</Heading>
      }
      {specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'small',
          mb: '0.6vmin',
          color: dark ? 'light' : 'dark',
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{specimen.common}</Heading>
      }
      {!specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'medium',
          lineHeight:'1.1',
          mb: '1vmin',
          color: dark ? 'light' : 'dark',
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{specimen.common}</Heading>
      }
      {attribution &&
        <Link
          href={specimen.url}
          target='_blank'
          sx={{
            fontFamily:'body',
            fontWeight:'bold',
            textTransform:'uppercase',
            letterSpacing:'0.1vmin',
            textDecoration:'none',
            fontSize:'miniscule',
            lineHeight:'1.1',
            color: dark ? 'ochre' : 'amber',
            ':hover':{
              color: dark ? 'amber' : 'marigold',
            }
        }}>{attribution}</Link>
      }
      <Text sx={{
        fontFamily:'body',
        fontSize:'teensy',
        lineHeight:'1.65',
        mt: '2vmin',
        color: dark ? 'light' : 'dark',
      }}>{ReactHtmlParser(specimen.caption)}</Text>
    </Box>
  )
}

export default Info
