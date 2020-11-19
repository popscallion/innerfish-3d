import React, {useContext} from 'react';
import {Box, Flex, Image, Text, Heading} from 'rebass';
import {Label, Select} from '@rebass/forms';
import styled from '@emotion/styled';
import { DataContext, ChapterContext, SetChapterContext, IdContext } from '../Context'

const DropDown = styled(Box)`
  & label {
    margin:10px 0px 4px 0px;
    font-family: Poppins;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 15px;
    margin-bottom: auto;
  }
  & select {
    letter-spacing: 0.5px;
    font-size: 14px;
  }
`


const Chapter = (props) => {
  const data = useContext(DataContext)
  const chapter = useContext(ChapterContext)
  const setChapter = useContext(SetChapterContext)

  return(
    <Box sx={{bg:'green', height:'100%',width:'100%'}}>
      <Heading sx={{}}>{chapter.split('-')[1]}</Heading>
      <DropDown as='form'>
        <Label htmlFor='chapterChoice'>Chapter</Label>
        <Select
          id='chapterChoice'
          value={chapter}
          onChange={e=>{setChapter(e.target.value)}}>
          {props.options
            .sort((a, b) => parseInt(a.slice(0,3))-parseInt(b.slice(0,3)))
            .map(item=>(
              <option value={item}>
                {item}
              </option>
            ))}
        </Select>
      </DropDown>
    </Box>
  )
}

export default Chapter
