import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import {Label, Select} from '@rebass/forms';
import styled from '@emotion/styled';
import { DataContext, ChapterContext, SetChapterContext, IdContext } from '../Context'

const Chapter = (props) => {
  const data = useContext(DataContext)
  const chapter = useContext(ChapterContext)
  const setChapter = useContext(SetChapterContext)

  return(
    <Box sx={{bg:'transparent', height:'fit-content',width:'20vw', pointerEvents:'all', alignSelf:'flex-start'}}>
      <Heading sx={{fontSize:'large', lineHeight:'1', letterSpacing:'0.1vmin', mb:'1vmin'}}>{chapter.split('-')[1]}</Heading>
      <Box as='form'>
        <Label htmlFor='chapterChoice' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.5vmin'
        }}>Chapter</Label>
        <Select
          id='chapterChoice'
          value={chapter}
          sx={{
            fontSize:'teensy',
            fontFamily:'body',
            letterSpacing:'0.1vmin',
            '& option': {
              fontFamily:'body',
              fontSize:'teensy',
              letterSpacing:'0.1vmin',
            }
          }}
          onChange={e=>{setChapter(e.target.value)}}>
          {props.options
            .sort((a, b) => parseInt(a.slice(0,3))-parseInt(b.slice(0,3)))
            .map(item=>(
              <option value={item}>
                {item}
              </option>
            ))}
        </Select>
      </Box>
    </Box>
  )
}

export default Chapter
