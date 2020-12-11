import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Flex, Image, Text, Heading, Link} from 'rebass';
import {Label, Select, Checkbox, Switch, Radio} from '@rebass/forms';
import styled from '@emotion/styled';
import { useTheme } from 'emotion-theming'
import { DataContext, ChapterContext, SetChapterContext, IdContext, SetIdContext, DarkContext, BackerContext, SetBackerContext, SectionContext, SetSectionContext} from '../Context'
import {ReactComponent as EyeOpen} from '../assets/eyeOpen.svg'
import {ReactComponent as EyeHalf} from '../assets/eyeHalf.svg'
import {ReactComponent as EyeShut} from '../assets/eyeShut.svg'




const Chapter = ({options, auto, setAuto}) => {
  const theme = useTheme()
  const data = useContext(DataContext)
  const chapter = useContext(ChapterContext)
  const setChapter = useContext(SetChapterContext)
  const id = useContext(IdContext)
  const setId = useContext(SetIdContext)
  const dark = useContext(DarkContext)
  const backer = useContext(BackerContext)
  const setBacker = useContext(SetBackerContext)
  const section = useContext(SectionContext)
  const setSection = useContext(SetSectionContext)

  const [sectionFilter, setSectionFilter] = useState(false)

  const videos = data.filter(datum => datum.type === "Video" && datum.chapter === chapter)
  const sections = [...new Set (data.filter(datum => datum.chapter === chapter).map(item => item.section).filter(section => section !== ""))]

  useEffect(()=>{
    if (!sectionFilter){
      setSection(null)
    }
  },[sectionFilter])

  useEffect(()=>{
    setSectionFilter(false)
    setSection(null)
  },[chapter])

  return(
    <Box sx={{px:'5vmin', py:'4vmin', bg: backer===1 ? dark ? 'light85' : 'dark85' : 'transparent', height:'fit-content',width:'min-content', maxWidth:'50vw', pointerEvents:'all', alignSelf:'flex-start', transition:'background-color 0.4s'}}>
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
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{chapter.split('.')[1]}</Heading>
      <Box
        as='form'
        sx={{
          mb:'2vmin',
          width:'fit-content',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
        }}>
        <Label htmlFor='chapterChoice' sx={{
          fontFamily:'body',
          fontWeight:'600',
          fontSize:'miniscule',
          textTransform:'uppercase',
          letterSpacing:'0.4vmin',
          mb:'0.75vmin',
        }}>Chapters</Label>
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
            opacity: backer !== 2 ? 1 : 0,
            transition:'opacity 0.4s',
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
      <Flex sx={{flexDirection:'row'}}>
        {videos.length > 0 &&
          <Box sx={{
            color:
              (backer===0 && dark) ? 'light' :
              (backer===0 && !dark) ? 'dark' :
              dark ? 'dark' : 'light',
            opacity: backer !== 2 ? 1 : 0,
            transition:'opacity 0.4s',
            mb:'2vmin',
            mr:'2vmin'
          }}>
            <Label htmlFor='videoChoice' sx={{
              fontFamily:'body',
              fontWeight:'600',
              fontSize:'miniscule',
              textTransform:'uppercase',
              letterSpacing:'0.4vmin',
              mb:'0.75vmin',
            }}>Videos</Label>
            <Flex
              id='videoChoice'
              sx={{

              }}>
              {videos
                .sort((a, b) => (a.scientific > b.scientific) ? 1 : -1)
                .map((item, i)=>(
                  <Link
                    sx={{
                          fontFamily:'body',
                          fontSize:'teensy',
                          color:  (backer===0 && dark) ? 'marigold' :
                                  (backer===0 && !dark) ? 'amber' :
                                  dark ? 'amber' : 'marigold',
                          fontWeight:'bold',
                          cursor: 'pointer',
                          mx:'0.5vmin',
                          ':hover':{
                            color:  (backer===0 && dark) ? 'amber' :
                                    (backer===0 && !dark) ? 'marigold' :
                                    dark ? 'marigold' : 'amber',
                          }
                        }}
                    onClick={()=> {setId(item.uid)}}>
                    {i+1}
                  </Link>
                ))}
            </Flex>
          </Box>
        }
        {sections.length > 0 &&
          <Box sx={{
            color:
              (backer===0 && dark) ? 'light' :
              (backer===0 && !dark) ? 'dark' :
              dark ? 'dark' : 'light',
            opacity: backer !== 2 ? 1 : 0,
            transition:'opacity 0.4s',
            mb:'2vmin',
          }}>
            <Label htmlFor='sectionChoice' sx={{
              fontFamily:'body',
              fontWeight:'600',
              fontSize:'miniscule',
              textTransform:'uppercase',
              letterSpacing:'0.4vmin',
              mb:'0.75vmin',
            }}>Sections</Label>
            <Flex id="sectionChoice">
              <Switch
                checked={sectionFilter}
                onClick={()=>setSectionFilter(!sectionFilter)}
                sx={{
                  mr: '1vmin',
                  borderColor:  (backer===0 && dark) ? 'light' :
                                (backer===0 && !dark) ? 'dark' :
                                dark ? 'dark' : 'light',
                  backgroundColor:  (backer===0 && dark) ? 'marigold' :
                                    (backer===0 && !dark) ? 'amber' :
                                    dark ? 'amber' : 'marigold',
                }}
              />
              {sectionFilter &&
                <>
                  {sections.map((item)=>(
                    <Box>
                      <Label
                        sx={{
                          alignItems:'center',
                          mr:'1vmin',
                          fontFamily:'body',
                          fontSize:'microscopic',
                          color:  (backer===0 && dark) ? 'light' :
                                  (backer===0 && !dark) ? 'dark' :
                                  dark ? 'dark' : 'light',
                          fontWeight:'bold',}}>
                        {item}
                        <Radio
                          name='section'
                          id={item}
                          value={item}
                          onChange={e=>setSection(e.target.value)}
                          sx={{
                            ml:'0.5vmin',
                            '& path':{
                              color:  (backer===0 && dark) ? 'marigold' :
                                      (backer===0 && !dark) ? 'amber' :
                                      dark ? 'amber' : 'marigold',
                            }
                          }}
                        />
                      </Label>
                    </Box>
                  ))}
                </>
              }
            </Flex>
          </Box>
        }
      </Flex>
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
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
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
              opacity: backer !== 2 ? 1 : 0,
              transition:'opacity 0.4s'
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
        'svg *': {
          fill: 'none'
        },
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
        theme.colors.dark} strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
        {backer===1 && <EyeHalf stroke={dark ? theme.colors.dark :
        theme.colors.light} strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
        {backer===2 && <EyeShut stroke={dark ? theme.colors.light : theme.colors.dark} strokeWidth='1.5vmin' width='3vmin' height='3vmin'/>}
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
