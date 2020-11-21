import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Heading } from 'rebass'
import {useWindowSize} from '@react-hook/window-size'
import {isMobileOnly} from 'react-device-detect'
import Viewer from './views/Viewer'
import Info from './views/Info'
import Chapter from './views/Chapter'
import Tree from './views/Tree'
import {formatJSON, loadData} from './data/loadAirtable'

export const HoverContext = React.createContext()
export const SetHoverContext = React.createContext()
export const DataContext = React.createContext()
export const SetIdContext = React.createContext()


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
  const [width, height] = useWindowSize()
  const availableChapters = [...new Set((data.map(({ chapter }) => chapter)).flat().sort())]
  const [chapter, setChapter] = useState(availableChapters[0])
  const [id, setId] = useState(data.find(datum => datum.chapter.includes(chapter) && datum.default).uid)
  const [hover, setHover] = useState(id)
  const [auto, setAuto] = useState(true)



  useEffect (() => {
    setId(data.find(datum => datum.chapter.includes(chapter) && datum.default).uid)
  },[chapter])

  return (
    <DataContext.Provider value={data}>
      <SetHoverContext.Provider value={setHover}>
        <HoverContext.Provider value={hover}>
          <SetIdContext.Provider value={setId}>
            {(isMobileOnly && height > width) &&
              <Flex sx={{ flexFlow:'column nowrap',
                          justifyContent:'center',
                          alignItems:'center',
                          height:'100%'}}>
                <Heading sx={{fontSize:'medium'}}>Please rotate your device to landscape mode.</Heading>
              </Flex>
            }
            {!(isMobileOnly && height > width) &&
              <>
                <Universe>
                  <Composer>
                    <Chapter chapter={chapter} setChapter={setChapter} options={availableChapters} auto={auto} setAuto={setAuto}/>
                    <Info id={id}/>
                  </Composer>
                  <Tree id={id} chapter={chapter}/>
                </Universe>
                <Viewer id={id} auto={auto}/>
              </>}
          </SetIdContext.Provider>
        </HoverContext.Provider>
      </SetHoverContext.Provider>
    </DataContext.Provider>
  );
}

export default Context;
