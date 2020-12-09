import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Heading } from 'rebass'
import {useWindowSize} from '@react-hook/window-size'
import {isMobileOnly} from 'react-device-detect'
import Viewer from './views/Viewer'
import Info from './views/Info'
import Chapter from './views/Chapter'
import Tree from './views/Tree'

export const DataContext = React.createContext()
export const SetIdContext = React.createContext()
export const SetDarkContext = React.createContext()


const Universe = ({children, dark}) => {
  return (
    <Flex
      sx={{
        bg: 'transparent',
        flexDirection:'column',
        justifyContent:'space-between',
        position: 'absolute',
        zIndex: 10,
        pointerEvents: 'none',
        width:'100%',
        height:'100%',
        overflow:'hidden',

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
        height:'75%',
        py:'2vh',
        overflow:'hidden',
      }}
    >
      {children}
    </Flex>
  )
}

const Context = ({data, dark, setDark}) => {
  const [width, height] = useWindowSize()
  const availableChapters = [...new Set((data.map(({ chapter }) => chapter)).flat().sort())]
  const [chapter, setChapter] = useState(availableChapters[0])
  const [id, setId] = useState(data.find(datum => datum.chapter.includes(chapter) && datum.default).uid)
  const [attribution, setAttribution] = useState(null)
  const [auto, setAuto] = useState(true)
  const [backer, setBacker] = useState(0)
  const [expand, setExpand] = useState(false)
  const [drawTree, setDrawTree] = useState(false)

  useEffect(()=>{
    if (backer > 2) {
      setBacker(0)
    }
  },[backer])

  useEffect (() => {
    setId(data.find(datum => datum.chapter.includes(chapter) && datum.default).uid)
  },[chapter])

  useEffect (() => {
    setTimeout(setDrawTree(true),1000)
  },[])

  return (
    <DataContext.Provider value={data}>
      <SetIdContext.Provider value={setId}>
        <SetDarkContext.Provider value={setDark}>
          {(isMobileOnly && height > width) &&
            <Flex sx={{ flexFlow:'column nowrap',
                        justifyContent:'center',
                        alignItems:'center',
                        width:'100%',
                        height:'100%'}}>
              <Heading sx={{fontSize:'medium'}}>Please rotate your device to landscape mode.</Heading>
              <Heading sx={{fontSize:'medium'}}>This site is not optimized for smaller screens.</Heading>
            </Flex>
          }
          {!(isMobileOnly && height > width) &&
            <>
              <Universe dark={dark}>
                <Composer>
                  <Chapter chapter={chapter} setChapter={setChapter} options={availableChapters} auto={auto} setAuto={setAuto} dark={dark} backer={backer} setBacker={setBacker}/>
                  <Info id={id} dark={dark} attribution={attribution} backer={backer}/>
                </Composer>
                {drawTree && <Tree id={id} chapter={chapter} dark={dark} expand={expand} setExpand={setExpand}/>}
              </Universe>
              <Viewer id={id} auto={auto} dark={dark} setAttribution={setAttribution} setBacker={setBacker} expand={expand}/>
            </>}
        </SetDarkContext.Provider>
      </SetIdContext.Provider>
    </DataContext.Provider>
  );
}

export default Context;
