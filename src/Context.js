import React, { useContext, useState, useEffect } from 'react'
import { Box, Flex, Heading } from 'rebass'
import Viewer from './views/Viewer'
import Info from './views/Info'
import Chapter from './views/Chapter'

import {formatJSON, loadData} from './data/loadAirtable'

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
        flexDirection:'column',
        bg:'background',
        height:'100vh',
        width:'100vw',
      }}
    >
      {children}
    </Flex>
  )
}

const Context = ({data}) => {
  const availableChapters = [...new Set((data.map(({ chapter }) => chapter)).flat().sort())]
  const [chapter, setChapter] = useState(availableChapters[0])
  const [id, setId] = useState(data.find(datum => datum.chapter.includes(chapter) && datum.showstopper).scientific)
  const [hover, setHover] = useState(id)

  useEffect (() => {
    setId(data.find(datum => datum.chapter.includes(chapter) && datum.showstopper).scientific)
  },[chapter])

  return (
    <DataContext.Provider value={data}>
      <SetChapterContext.Provider value={setChapter}>
        <ChapterContext.Provider value={chapter}>
          <SetIdContext.Provider value={setId}>
            <IdContext.Provider value={id}>
              <SetHoverContext.Provider value={setHover}>
                <HoverContext.Provider value={hover}>
                  <Universe>
                    <Flex sx={{height:'75%'}}>
                      <Chapter options={availableChapters}/>
                      <Viewer />
                      <Info />
                    </Flex>
                  </Universe>
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
