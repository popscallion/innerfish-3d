import React, {useContext} from 'react';
import ReactHtmlParser from 'react-html-parser';
import {Box, Flex, Image, Text, Heading, Link} from 'rebass';
import Markdown from 'markdown-to-jsx'
import { useTheme } from 'emotion-theming'
import { DataContext, IdContext, SetIdContext, DarkContext, BackerContext} from '../Context'



const Info = ({attribution}) => {
  const theme = useTheme()

  const data = useContext(DataContext)
  const setId = useContext(SetIdContext)
  const id = useContext(IdContext)
  const dark = useContext(DarkContext)
  const backer = useContext(BackerContext)

  const specimen = data.find(datum => datum.uid === id)

  const LinkCatcher= props =>{
    return(
        <Link sx={{
          color:'sea',
          fontWeight:'bold',
          cursor: 'pointer',
          ':hover':{
            color:'sky',
          }
        }}
        onClick={()=> {setId(props.href.replace('#',''))}}>{props.children}</Link>
    )
  }

  return(
    <Box sx={{px:'5vmin', py:'4vmin', bg: backer===1 ? dark ? 'light85' : 'dark85' : 'transparent', height:'fit-content',width:'fit-content', maxWidth:'30vw',  pointerEvents:'all',alignSelf:'flex-end', transition:'background-color 0.4s'}}>
      {specimen.scientific &&
        <Heading sx={{
          fontSize:'medium',
          fontStyle:'italic',
          lineHeight:'1.1',
          mb: '1vmin',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{specimen.scientific}</Heading>
      }
      {specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'small',
          mb: '0.6vmin',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
          // textShadow: `0.1vmin 0.1vmin 0.3vmin ${theme.colors.dark50}`,
        }}>{specimen.common}</Heading>
      }
      {!specimen.scientific && specimen.common &&
        <Heading sx={{
          fontSize:'medium',
          lineHeight:'1.1',
          mb: '1vmin',
          color:
            (backer===0 && dark) ? 'light' :
            (backer===0 && !dark) ? 'dark' :
            dark ? 'dark' : 'light',
          opacity: backer !== 2 ? 1 : 0,
          transition:'opacity 0.4s'
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
            color:
              (backer===0 && dark) ? 'ochre' :
              (backer===0 && !dark) ? 'amber' :
              dark ? 'amber' : 'ochre',
            opacity: backer !== 2 ? 1 : 0,
            transition:'opacity 0.4s',
            ':hover':{
              color: dark ? 'amber' : 'marigold',
            }
        }}>{attribution}</Link>
      }
      {/*<Text sx={{
        fontFamily:'body',
        fontSize:'teensy',
        lineHeight:'1.65',
        mt: '2vmin',
        color: dark ? 'light' : 'dark',
      }}>{ReactHtmlParser(specimen.caption)}</Text>*/}
      <Text sx={{
        fontFamily:'body',
        fontSize:'teensy',
        lineHeight:'1.65',
        mt: '2vmin',
        color:
          (backer===0 && dark) ? 'light' :
          (backer===0 && !dark) ? 'dark' :
          dark ? 'dark' : 'light',
        opacity: backer !== 2 ? 1 : 0,
        transition:'opacity 0.4s',
      }}>
        <Markdown options={{overrides:{a:{component:LinkCatcher}}}}>
          {specimen.caption}
        </Markdown>
      </Text>
    </Box>
  )
}

export default Info
