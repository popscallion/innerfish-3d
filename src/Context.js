import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Heading } from 'rebass'
import Viewer from './views/Viewer'
import Info from './views/Info'
import Chapter from './views/Chapter'
import Tree from './views/Tree'
import {formatJSON, loadData} from './data/loadAirtable'
import {isMobileOnly} from 'react-device-detect'

export const HoverContext = React.createContext()
export const SetHoverContext = React.createContext()
export const IdContext = React.createContext()
export const SetIdContext = React.createContext()
export const ChapterContext = React.createContext()
export const SetChapterContext = React.createContext()
export const DataContext = React.createContext()



const Universe = ({children}) => {
  return (
    <Flex
      sx={{
        bg:'transparent',
        flexDirection:'column',
        justifyContent:'space-between',
        position: 'absolute',
        zIndex: 10,
        pointerEvents: 'none',
        width:'100%',
        height:'100%',

      }}
    >
      {children}
    </Flex>
  )
}


const Composer = ({children}) => {
  return (
    <Flex
      sx={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        bg:'transparent',
        pointerEvents: 'none',
        width:'100%',
        height:'100%',
        px:'5vw',
        py:'8vh'
      }}
    >
      {children}
    </Flex>
  )
}

const Context = ({data}) => {
  const availableChapters = [...new Set((data.map(({ chapter }) => chapter)).flat().sort())]
  const [chapter, setChapter] = useState(availableChapters[0])
  const [id, setId] = useState(data.find(datum => datum.chapter.includes(chapter) && datum.default).scientific)
  const [hover, setHover] = useState(id)
  const [auto, setAuto] = useState(true)

  useEffect (() => {
    setId(data.find(datum => datum.chapter.includes(chapter) && datum.default).scientific)
  },[chapter])

  return (
    <DataContext.Provider value={data}>
      <SetChapterContext.Provider value={setChapter}>
        <ChapterContext.Provider value={chapter}>
          <SetIdContext.Provider value={setId}>
            <IdContext.Provider value={id}>
              <SetHoverContext.Provider value={setHover}>
                <HoverContext.Provider value={hover}>
                  {(isMobileOnly && window.innerHeight > window.innerWidth) &&
                    <Flex sx={{ flexFlow:'column nowrap',
                                justifyContent:'center',
                                alignItems:'center',
                                height:'100%'}}>
                      <Heading sx={{fontSize:'medium'}}>Please rotate your device to landscape mode.</Heading>
                    </Flex>
                  }
                  {!(isMobileOnly && window.innerHeight > window.innerWidth) &&
                    <>
                      <Universe>
                        <Composer>
                          <Chapter options={availableChapters} auto={auto} setAuto={setAuto}/>
                          <Info />
                        </Composer>
                        <Tree/>
                      </Universe>
                      <Viewer auto={auto}/>
                    </>}
                </HoverContext.Provider>
              </SetHoverContext.Provider>
            </IdContext.Provider>
          </SetIdContext.Provider>
        </ChapterContext.Provider>
      </SetChapterContext.Provider>
    </DataContext.Provider>
  );
}

export default Context;
