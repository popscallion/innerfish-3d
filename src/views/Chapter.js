import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import {Label, Select, Checkbox} from '@rebass/forms';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming'
import { DataContext} from '../Context'



const Chapter = ({chapter, setChapter, options, auto, setAuto, dark}) => {
  const theme = useTheme()
  const data = useContext(DataContext)
  return(
    <Box sx={{bg:'transparent', height:'fit-content',width:'20vw', pointerEvents:'all', alignSelf:'flex-start'}}>
      <Heading
        sx={{
          fontSize:'large',
          lineHeight:'1',
          letterSpacing:'0.1vmin',
          mb:'2.5vmin',
          color: dark ? 'light' : 'dark',
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{chapter.split('-')[1]}</Heading>
      <Box as='form' sx={{mb:'2vmin', color: dark ? 'light' : 'dark',}}>
        <Label htmlFor='chapterChoice' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.75vmin',
          color: dark ? 'light' : 'dark',
        }}>Chapter</Label>
        <Select
          id='chapterChoice'
          value={chapter}
          sx={{
            fontSize:'teensy',
            fontFamily:'body',
            letterSpacing:'0.1vmin',
            color: dark ? 'light' : 'dark',
            bg: dark ? 'inky' : 'transparent',
            borderWidth: '0.2vmin'
          }}
          onChange={e=>{setChapter(e.target.value)}}>
          {options
            .sort((a, b) => parseInt(a.slice(0,3))-parseInt(b.slice(0,3)))
            .map(item=>(
              <option value={item}>
                {item}
              </option>
            ))}
        </Select>
      </Box>
      <Box as='form'>
        <Label htmlFor='autoLoad' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.5vmin',
          display:'flex',
          alignItems:'center',
          color: dark ? 'light' : 'dark'
        }}>
          AUTOPLAY
          <Checkbox
            id='autoLoad'
            sx={{ml:'0.75vmin', color: dark ? 'light' : 'dark'}}
            checked={auto}
            onClick={() => {setAuto(!auto)}}/>
        </Label>
      </Box>
    </Box>
  )
}

export default Chapter
