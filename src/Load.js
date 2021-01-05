import React, { useState, useEffect } from 'react'
import { Flex, Heading } from 'rebass'
import Context from './Context';

import dummyData from './data/dummy'
import { loadAirtable } from './data/loadAirtable'

const Load = ({demo}) => {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    if (demo) {
      const chapter1Data = dummyData.filter(datum=>datum.chapter === "1. Field Paleontology")
      setData(chapter1Data)
      setLoaded(true)
    }
    else {
      (async () => {
        const fetchedData = await loadAirtable()
        setData(fetchedData)
        setLoaded(true)
      })()
    }
  }, [demo])

  if (loaded) {
    return (
      <Flex sx={{bg: dark ? 'dark' : 'light', width:'100vw', height:'100vh', transition:'background-color 0.4s'}} >
        <Context data={data} dark={dark} setDark={setDark}/>
      </Flex>
    )
  } else {
    return (
        <Flex sx={{ flexFLow:'column nowrap',
                    justifyContent:'center',
                    alignItems:'center',
                    height:'100vh',
                    bg: 'light'}}>
          <Heading sx={{fontSize:'medium', color:'dark'}}>Loading...</Heading>
        </Flex>
    )
  }
}

export default Load;
