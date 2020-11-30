import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { useTheme } from 'emotion-theming'
import { Box, Button, Flex } from 'rebass'
import { Stage, Layer, Circle, Text, Rect, RegularPolygon, Path} from 'react-konva';
import useDebounce from '../hooks/useDebounce';
import { useWindowSize } from '@react-hook/window-size';
import { DataContext, SetIdContext } from '../Context'
import {ReactComponent as ExpandArrow} from '../assets/expand.svg'
import {ReactComponent as ContractArrow} from '../assets/contract.svg'


const treeData = [
  { "node": "Chapter", "parent": null},
  { "node": "Metazoa", "parent": null },
  { "node": "Metazoans", "parent": "Metazoa" },
  { "node": "Bilateria", "parent": "Metazoa" },
  { "node": "Bilaterians", "parent": "Bilateria" },
  { "node": "Chordata", "parent": "Bilateria" },
  { "node": "Chordates", "parent": "Chordata" },
  { "node": "Cyclostomata", "parent": "Chordata" },
  { "node": "Vertebrates", "parent": "Cyclostomata" },
  { "node": "Gnathostomata", "parent": "Cyclostomata" },
  { "node": "Jawed Fish", "parent": "Gnathostomata" },
  { "node": "Osteichthyes", "parent": "Gnathostomata" },
  { "node": "Bony Fish", "parent": "Osteichthyes" },
  { "node": "Tetrapoda", "parent": "Osteichthyes" },
  { "node": "Tetrapods", "parent": "Tetrapoda" },
  { "node": "Amniota", "parent": "Tetrapoda" },
  { "node": "Sauropsida", "parent": "Amniota" },
  { "node": "Synapsida", "parent": "Amniota" },
  { "node": "Reptiles", "parent": "Sauropsida" },
  { "node": "Birds", "parent": "Sauropsida" },
  { "node": "Mammals", "parent": "Synapsida" },
  { "node": "Primates", "parent": "Synapsida" },
]

const Node = ({x, y, scale, name, uid, type, textAlign, fontStyle, branch, lit, theme, dark, width, setId, activeId}) => {

  const [hover, setHover] = useState(false)
  const debouncedHover = useDebounce(hover, 50)
  const [current, setCurrent ] = useState(false)
  const fillColor = dark ? theme.colors.ochre : theme.colors.amber
  const strokeColor = dark ? theme.colors.light : theme.colors.dark
  const fontSize = scale*1.75
  const lineHeight = 1
  const fontFamily = theme.fonts.heading
  const letterSpacing = 0

  useEffect(()=>{
    if (activeId && uid){
      if (activeId === uid){
        setCurrent(true)
      } else {
        setCurrent(false)
      }}
  })

  const hoverOn = e => {
    setHover(true)
    if (uid) {
      const container = e.target.getStage().container();
      container.style.cursor = "pointer";
    }
  }
  const hoverOff = e => {
    setHover(false)
    if (uid) {
      const container = e.target.getStage().container();
      container.style.cursor = "default";
    }
  }
  const handleClick = () => {
    setId(uid)
  }
  return (
    <>
      {type === 'Video' &&
        <RegularPolygon x={x} y={y} fill={current ? fillColor : hover ? strokeColor : null} stroke={strokeColor} radius={scale} sides={3} rotation={90} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {type === 'Image' &&
        <RegularPolygon x={x} y={y} fill={current ? fillColor : hover ? strokeColor : null} stroke={strokeColor} radius={scale*1.25} sides={4} rotation={45} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {type === 'Model' &&
        <Circle x={x} y={y} fill={current ? fillColor : hover ? strokeColor : null} stroke={strokeColor} radius={scale} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {!type && branch &&
        <>
          <Circle x={x} y={y} fill={strokeColor} stroke={strokeColor} radius={scale/2} opacity={debouncedHover && lit ? 1 : debouncedHover && !lit ? 0.5 : lit ? 0.9 : 0.2}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}/>
          <Path data={branch} stroke={strokeColor} strokeWidth={scale/2} opacity={debouncedHover && lit ? 1 : debouncedHover && !lit ? 0.5 : lit ? 0.8 : 0.2} onMouseEnter={hoverOn}
          onMouseLeave={hoverOff} />
        </>
      }
      <Text text={name} x={textAlign === 'left' ? x+scale*2 : x-scale*22} y={type ? y-scale*2 : y} align={textAlign} verticalAlign='middle' width={scale*20} height={scale*4} lineHeight={lineHeight} fill={!current ? strokeColor : fillColor} opacity={1} fontFamily={fontFamily} fontStyle={fontStyle} fontSize={fontSize} letterSpacing={letterSpacing} padding={0} visible={current ? true : lit ? true : debouncedHover ? true : false}/>
      {/*<Rect x={textAlign === 'left' ? x+scale*1 : x-scale*22} y={type ? y-scale*2 : y} width={scale*20} height={scale*5} stroke={strokeColor} visible={current ? true : lit ? true : hover ? true : false}/>*/}
    </>
  )
}

const Stack = ({x, y, scale, name, groupedIds, setId, activeId, textAlign, theme, dark, width}) => {
  const spacing = scale*4
  const children = groupedIds ? groupedIds.map((item,i) => {
    return <Node x={x} y={y-(spacing*(i+1))} scale={scale*1.1} name={item.scientific ? item.scientific : item.common } fontStyle={item.scientific ? 'italic 700' : 'normal 700'} uid={item.uid} type={item.type} textAlign={textAlign} setId={setId} activeId={activeId} theme={theme} dark={dark} width={width}/>}) : null
  return (
    <>
      {children}
    </>
  )
}

const parseTree = (flat) => {
  const result = []
  const queryParent = (current, starting, depth=0) => {
    if (current.parent) {
      const next = flat.find(el => el.node === current.parent)
      depth++
      if (next.parent) {
        return queryParent(next, starting, depth)
      } else {
        return {"node":starting.node, "parent":starting.parent, "depth":depth}
      }
    } else {
      return {"node":starting.node, "parent":starting.parent, "depth":depth}
    }
  }
  flat.forEach(item => { //assign depth to every node
    const res = queryParent(item, item, 0)
    result.push(res)
  });
  result.forEach((item, i) => { //assign children by node name
    result[i] = {...item, "children":result.filter(el => el.parent ===item.node).map(child => child.node)}
  })
  result.forEach(item => { //final pass to nest actual child objects
    item.children.forEach((child, i) => {
      item.children[i] = result.find(el => el.node === child)
    })
  })
  return result
}

const getMaxDepth = parsed => {
  return parsed.reduce((max, val)=> val.depth > max ? val.depth : max, parsed[0].depth)
}

const getMaxLength = arr => {
  return arr.reduce((max, val)=> val.length > max ? val.length : max, arr[0].length)
}

const getLayout = (parsed, width, height, treeScale, maxDepth, tips, inners, groupOffset) => {
  const nodes = []
  const xOffset = width/(tips.length+1)
  const yOffset = (groupOffset+1)*4*treeScale
  const radius = height/(maxDepth+1)

  tips.forEach((el, i) => {
    const update = {
        node: el.node,
        x: xOffset*(i+1),
        y: yOffset,
        parent:el.parent,
        ids:el.ids
    }
    nodes.push(update)
  })
  for (let i=maxDepth-1 ; i>=0; i--){
    const nodesAtDepth = inners.filter(item => item.depth === i)
    nodesAtDepth.forEach((el, it) => {
      const update = {
        node:el.node,
        x: nodes.filter(item=>el.children.map(child=>child.node).includes(item.node)).reduce((acc, val, _, {length}) => {return acc+val.x / length}, 0),
        y: height - (i+1)*(height-yOffset)/(maxDepth+1),
        parent:el.parent,
      }
      nodes.push(update)
    })
  }
  const result = nodes.map(item => {
    const parent = nodes.find(el => el.node === item.parent)
    return {...item, branch: item.parent && item.x < parent.x ?
      `M ${item.x} ${item.y+treeScale/2} v ${parent.y-item.y-(radius+treeScale)/2} a ${radius/2} ${radius/2} 0 -1 -1 ${radius/2} ${radius/2} h ${parent.x-item.x-(radius+treeScale)/2}` :
      item.parent && item.x > parent.x ?
      `M ${item.x} ${item.y+treeScale/2} v ${parent.y-item.y-(radius+treeScale)/2} a ${radius/2} ${radius/2} 0 0 1 -${radius/2} ${radius/2} h ${parent.x-item.x+(radius+treeScale)/2}` : item.node === "Chapter" ? `M ${item.x} ${item.y} v ${height} ` :
      `M ${item.x} ${item.y} v ${(radius)}`}
  })
  const litTips = result.filter(item => item.ids && item.ids.length)
  litTips.forEach(item => {
    const litBranches = tipToRoot(result, item)
    litBranches.forEach(item => {
      result.find(el=>el.node === item).lit = true
    })
  })
  return result
}

const tipToRoot = (arr, tip) => {
  const result = []
  while (tip.parent) {
    result.push(tip.node)
    tip = {...arr.find(el=>el.node == tip.parent)}
  }
  result.push(tip.node)
  return result
}

const Tree = ({id, chapter, dark, expand, setExpand}) => {
  const theme = useTheme()
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setId = useContext(SetIdContext)

  const [layout, setLayout] = useState(null)
  const [groups, setGroups] = useState(null)

  const parsedTree = useRef(parseTree(treeData))
  const maxDepth = useRef(getMaxDepth(parsedTree.current))
  const tips = useRef(parsedTree.current.filter(item => !item.children.length))
  const inners = useRef(parsedTree.current.filter(item => item.children.length))

  const treeScale = width/250

  useEffect(()=>{
    if (parsedTree.current.length && groups) {
      setLayout(getLayout(parsedTree.current, width, height*0.6, treeScale, maxDepth.current, groups[0], inners.current, groups[2]))
    }
  },[width,height,groups])

  useEffect(()=>{
    console.log(layout);
  },[layout])

  useEffect(()=>{
    const availableIds = data.filter(datum => datum.chapter === chapter)
    const availableGroups = [...new Set (availableIds.map(id => id.group))]
    const idsPerGroup = availableGroups.map(group => availableIds.filter(item => item.group === group))
    const grouped = Object.fromEntries(availableGroups.map((_, i) => [availableGroups[i], idsPerGroup[i]]))
    const tipsWithIds = tips.current.map( x => Object.assign(x, {"ids":grouped[x.node]}))
    const miscIds = availableIds.filter(datum => !datum.group)
    const maxGroupSize = getMaxLength(Object.values(grouped))
    setGroups([tipsWithIds, miscIds, maxGroupSize])
  },[chapter, id])


  if (layout){
    return (
      <>
        <Box sx={{pointerEvents:'all', backgroundImage: !dark && expand ? `linear-gradient(transparent, ${theme.colors.light})` : dark && expand ? `linear-gradient(transparent, ${theme.colors.dark})` : 'transparent', width:{width}, height: expand ? height*0.6 : height*0.2,  transition:'all 0.4s', zIndex:20}}>
          <Stage width={width} height={expand ? height*0.6 : height*0.2}>
            <Layer>
                <>
                  {layout.map((el, i) => {
                    return(
                      <>
                        <Node x={el.x} y={el.y} scale={treeScale} branch = {el.branch} name={el.node} textAlign='left' fontStyle='normal 700' theme={theme} dark={dark} width={width} lit={el.lit}/>
                        <Stack x={el.x} y={el.y} scale={treeScale} name={el.node} groupedIds={el.ids} setId={setId} activeId={id} textAlign={i < groups[0].length/2 ? 'left' : 'right'} theme={theme} dark={dark} width={width}/>
                      </>
                    )
                  })
                  }
                </>
            </Layer>
          </Stage>
        </Box>
        <Button sx={{
          cursor: 'pointer',
          border: 'none',
          bg: 'transparent',
          width:'8vmin', height:'4vmin',
          position:'absolute',
          bottom:'0',
          left:'50vw',
          right:'50vw',
          zIndex:'25',
          cursor:'pointer',
          pointerEvents:'all',
          p: 0,
          m: 0,
          'svg': {
            '.a': {fill: dark ? 'dark' : 'light', opacity: 0,},
            '.b': {fill: dark ? 'ochre': 'amber', opacity: 0.9},
          },
          ':hover svg': {
            '.a': {fill: dark ? 'ochre' : 'amber', opacity: 0.9,},
            '.b': {fill: dark ? 'light': 'dark', opacity: 0.9,},
          }
        }} onClick={()=>setExpand(!expand)}>
          {expand &&
            <ContractArrow
              fill={dark ? theme.colors.light : theme.colors.dark}
            />
          }
          {!expand &&
            <ExpandArrow
              fill={dark ? theme.colors.light : theme.colors.dark}
            />
          }
        </Button>
      </>
  )}
  else {
    return (
      <></>
    )
  }


}

export default Tree
