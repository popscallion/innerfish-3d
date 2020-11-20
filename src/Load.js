import React, { useContext, useState, useEffect } from 'react'
import { Flex, Heading } from 'rebass'
import Context from './Context';


import { loadAirtable } from './data/loadAirtable'

const Load = () => {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState()
  useEffect(() => {
    (async () => {
      const fetchedData = await loadAirtable()
      setData(fetchedData)
      setLoaded(true)
    })()
  }, [])

  if (loaded) {
    return (
      <Context data={data}/>
    )
  } else {
    return (
        <Flex sx={{ flexFLow:'column nowrap',
                    justifyContent:'center',
                    alignItems:'center',
                    minHeight:'100vh'}}>
          <Heading sx={{fontSize:'medium'}}>Loading...</Heading>
        </Flex>
    )
  }
}

export default Load;
