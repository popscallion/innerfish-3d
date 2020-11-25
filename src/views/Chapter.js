import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Flex, Image, Text, Heading} from 'rebass';
import {Label, Select, Checkbox} from '@rebass/forms';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming'
import { DataContext} from '../Context'
import {ReactComponent as EyeOpen} from '../assets/eyeOpen.svg'
import {ReactComponent as EyeHalf} from '../assets/eyeHalf.svg'
import {ReactComponent as EyeShut} from '../assets/eyeShut.svg'




const Chapter = ({chapter, setChapter, options, auto, setAuto, dark, backer, setBacker}) => {
  const theme = useTheme()
  const data = useContext(DataContext)

  return(
    <Box sx={{px:'5vmin', py:'4vmin', bg: backer===1 ? dark ? 'light85' : 'dark85' : 'transparent', height:'fit-content',width:'fit-content', maxWidth:'30vw', pointerEvents:'all', alignSelf:'flex-start', transition:'all 0.4s'}}>
      <Heading
        sx={{
          fontSize:'large',
          lineHeight:'1',
          letterSpacing:'0.1vmin',
          mb:'2.5vmin',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          visibility: backer !== 2 ? 'visible' : 'hidden',
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{chapter.split('-')[1]}</Heading>
      <Box
        as='form'
        sx={{
          mb:'2vmin',
          width:'fit-content',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          visibility: backer !== 2 ? 'visible' : 'hidden',
        }}>
        <Label htmlFor='chapterChoice' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.75vmin',
        }}>Chapter</Label>
        <Select
          id='chapterChoice'
          value={chapter}
          sx={{
            pr: '3vmin',
            fontSize:'teensy',
            fontFamily:'body',
            letterSpacing:'0.1vmin',
            color:
              (backer===0 && dark) ? 'light' :
              (backer===0 && !dark) ? 'dark' :
              dark ? 'dark' : 'light',
            visibility: backer !== 2 ? 'visible' : 'hidden',
            bg:
              (backer===0 && dark) ? 'inky' :
              (backer===0 && !dark) ? 'transparent' :
              dark ? 'transparent' : 'inky',
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
      <Box as='form' sx={{mb:'1vmin'}}>
        <Label htmlFor='autoLoad' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.5vmin',
          display:'flex',
          alignItems:'center',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          visibility: backer !== 2 ? 'visible' : 'hidden',
        }}>
          AUTOPLAY
          <Checkbox
            id='autoLoad'
            sx={{
              ml:'0.75vmin',
              color:
                (backer===0 && dark) ? 'light' :
                (backer===0 && !dark) ? 'dark' :
                dark ? 'dark' : 'light',
              visibility: backer !== 2 ? 'visible' : 'hidden',
            }}
            checked={auto}
            onClick={() => {setAuto(!auto)}}/>
        </Label>
      </Box>
      <Button sx={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        cursor: 'pointer',
        border: 'none',
        bg: 'transparent',
        p: 0,
        m: 0,
        ':hover svg': {
          stroke:   (backer===0 && dark) ? 'marigold' :
                    (backer===0 && !dark) ? 'amber' :
                    dark ? 'amber' : 'marigold',
        },
        'div': {
            visibility: 'hidden',
        },
        ':hover div': {
            visibility: 'visible',
        },
      }} onClick={()=>setBacker(backer+1)}>
        {backer===0 && <EyeOpen stroke={dark ? theme.colors.light :
        theme.colors.dark} fill='none' strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
        {backer===1 && <EyeHalf stroke={dark ? theme.colors.dark :
        theme.colors.light} fill='none' strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
        {backer===2 && <EyeShut stroke={dark ? theme.colors.light : theme.colors.dark} fill='none' strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
        <Text
          sx={{
            ml:'0.5vmin',
            fontFamily:'body',
            fontWeight:'600',
            fontSize:'microscopic',
            textTransform:'uppercase',
            letterSpacing:'0.15vmin',
            color:  (backer===0 && dark) ? 'marigold' :
                    (backer===0 && !dark) ? 'amber' :
                    dark ? 'amber' : 'marigold',
          }}>toggle overlay</Text>
      </Button>
    </Box>
  )
}

export default Chapter
