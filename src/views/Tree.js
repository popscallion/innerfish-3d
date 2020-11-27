import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { useTheme } from 'emotion-theming'
import { Box, Button, Flex } from 'rebass'
import { Stage, Layer, Circle, Text, Rect, RegularPolygon, Path} from 'react-konva';
import { useWindowSize } from '@react-hook/window-size';
import { DataContext, SetIdContext } from '../Context'
import {ReactComponent as ExpandArrow} from '../assets/expand.svg'
import {ReactComponent as ContractArrow} from '../assets/contract.svg'


const treeData = [
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
//
// const Node = ({x, y, i=0, spc=0.16, radius=20, text="", fontSize=16, lineHeight=1, uid=null, type=null, textfill=null, pathfill=null, stroke=null, opacity=1, fontFamily=null, textAlign='center', style='normal', letterSpacing=0.25, setId, active, width}) => {
//   const [hover, setHover] = useState(false)
//   const [current, setCurrent ] = useState(false)
//
//   useEffect(()=>{
//     if (active !== uid){
//       setCurrent(false)
//     } else {
//       setCurrent(true)
//     }
//   },[active])
//
//   const hoverOn = e => {
//     setHover(true)
//     if (uid) {
//       const container = e.target.getStage().container();
//       container.style.cursor = "pointer";
//     }
//   }
//   const hoverOff = e => {
//     setHover(false)
//     if (uid) {
//       const container = e.target.getStage().container();
//       container.style.cursor = "default";
//     }
//   }
//   const handleClick = () => {
//     setId(uid)
//   }
//   return (
//     <>
//       {type === 'Video' && <RegularPolygon x={x} y={((i-3)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius} sides={3} rotation={90} opacity={opacity}
//               onMouseEnter={hoverOn}
//               onMouseLeave={hoverOff}
//               onClick={uid ? handleClick : null}
//               />}
//       {type === 'Image' && <RegularPolygon x={x} y={((i-3)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius*1.25} sides={4} rotation={45} opacity={opacity}
//               onMouseEnter={hoverOn}
//               onMouseLeave={hoverOff}
//               onClick={uid ? handleClick : null}
//               />}
//       {type === 'Model' && <Circle x={x} y={((i-3)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius} opacity={opacity}
//               onMouseEnter={hoverOn}
//               onMouseLeave={hoverOff}
//               onClick={uid ? handleClick : null}
//               />}
//       {!type && <Circle x={x} y={((i+1)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius/2} opacity={opacity}
//       onMouseEnter={hoverOn}
//       onMouseLeave={hoverOff}
//       />}
//       <Text text={text} x={x-radius*22} y={type ? ((i-3)*spc+(0.88))*y : y-radius/2} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*6} lineHeight={lineHeight} fill={textfill} opacity={opacity} fontFamily={fontFamily} fontStyle={style} fontSize={fontSize} letterSpacing={letterSpacing} visible={current ? true : hover ? true : false}/>
//       {/*<Rect x={x-radius*22} y={type ? (i*(y))*spc+radius/2 : y-radius} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*5} stroke={textfill} visible={true}/>*/}
//     </>
//   )
// }

// const Group = ({x, y, radius, name, ids, position, setId, active, theme, dark, width}) => {
//   const children = ids ? ids.map((item,i) => {
//     return <Node x={x} y={y} i={i} radius={radius} stroke={dark ? theme.colors.light : theme.colors.royal} text={item.scientific ? item.scientific : item.common } textfill={dark ? theme.colors.light : theme.colors.dark} pathfill={dark ? theme.colors.ochre : theme.colors.amber} opacity={0.85} style={item.scientific ? 'italic 700' : 'normal 700'} uid={item.uid} type={item.type} fontFamily={theme.fonts.heading} textAlign={position} setId={setId} active={active} width={width}/>}) : null
//   return (
//     <>
//       <Node x={x} y={y} radius={radius} i={-1} pathfill={dark ? theme.colors.light : theme.colors.dark} textfill={dark ? theme.colors.light : theme.colors.dark} opacity={0.85} text={name} uid={null} fontFamily={theme.fonts.heading} style='normal 700' textAlign={position} width={width}/>
//       {children}
//     </>
//   )
// }

const Node = ({x, y, scale, name, uid, type, textAlign, fontStyle, branch, lit, theme, dark, width, setId, activeId}) => {

  const [hover, setHover] = useState(false)
  const [current, setCurrent ] = useState(false)
  const fillColor = dark ? theme.colors.ochre : theme.colors.amber
  const strokeColor = dark ? theme.colors.light : theme.colors.dark
  const fontSize = 16
  const lineHeight = 1.1
  const fontFamily = theme.fonts.heading
  const letterSpacing = 0.25

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
        <RegularPolygon x={x} y={y} fill={uid && !current ? null : fillColor} stroke={strokeColor} radius={scale} sides={3} rotation={90} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {type === 'Image' &&
        <RegularPolygon x={x} y={y} fill={uid && !current ? null : fillColor} stroke={strokeColor} radius={scale*1.25} sides={4} rotation={45} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {type === 'Model' &&
        <Circle x={x} y={y} fill={uid && !current ? null : fillColor} stroke={strokeColor} radius={scale} opacity={0.85}
        onMouseEnter={hoverOn}
        onMouseLeave={hoverOff}
        onClick={uid ? handleClick : null}/>
      }
      {!type && branch &&
        <>
          <Circle x={x} y={y} fill={strokeColor} stroke={strokeColor} radius={scale/2} opacity={hover && lit ? 1 : hover && !lit ? 0.5 : lit ? 0.9 : 0.2}
          onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}/>
          <Path data={branch} stroke={strokeColor} strokeWidth={scale/2} opacity={hover && lit ? 1 : hover && !lit ? 0.5 : lit ? 0.8 : 0.2} onMouseEnter={hoverOn}
          onMouseLeave={hoverOff}/>
        </>
      }
      <Text text={name} x={textAlign === 'left' ? x : x-scale*25} y={type ? y-scale*2 : y} align={textAlign} verticalAlign='middle' width={scale*25} height={scale*4} lineHeight={1.1} fill={strokeColor} opacity={hover && lit ? 1 : hover && !lit ? 0.5 : lit ? 0.9 : 0.2} fontFamily={fontFamily} fontStyle={fontStyle} fontSize={fontSize} letterSpacing={letterSpacing} padding={textAlign === 'left' ? scale : scale*2} visible={current ? true : lit ? true : hover ? true : false}/>
      {/*<Rect x={textAlign === 'left' ? x : x-scale*25} y={type ? y-scale*2 : y} width={scale*25} height={scale*5} stroke={strokeColor} visible={current ? true : lit ? true : hover ? true : false}/>*/}
    </>
  )
}

const Stack = ({x, y, scale, name, groupedIds, setId, activeId, textAlign, theme, dark, width}) => {
  const spacing = scale*5
  const children = groupedIds ? groupedIds.map((item,i) => {
    return <Node x={x} y={y-(spacing*(i+1))} scale={scale*1.25} name={item.scientific ? item.scientific : item.common } fontStyle={item.scientific ? 'italic 700' : 'normal 700'} uid={item.uid} type={item.type} textAlign={textAlign} setId={setId} activeId={activeId} theme={theme} dark={dark} width={width}/>}) : null
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
  console.log(result);
  return result
}

const getMaxDepth = parsed => {
  return parsed.reduce((max, val)=> val.depth > max ? val.depth : max, parsed[0].depth)
}

const getLayout = (parsed, width, height, treeScale, maxDepth, tips, inners) => {
  console.log(tips);
  const nodes = []
  const xOffset = width/(tips.length+1)
  const yOffset = height/(maxDepth+4)
  tips.forEach((el, i) => {
    const xPos = xOffset*(i+1)
    const yPos = yOffset*3.5
    const update = {
        node: el.node,
        x: xPos,
        y: yPos,
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
        y: height-yOffset*(i+0.5),
        parent:el.parent,
      }
      console.log(update);
      nodes.push(update)
    })
  }
  const result = nodes.map(item => {
    const parent = nodes.find(el => el.node === item.parent)
    return {...item, branch: item.parent && item.x < parent.x ?
      `M ${item.x} ${item.y+treeScale/2} v ${parent.y-item.y-(yOffset+treeScale)/2} a ${yOffset/2} ${yOffset/2} 0 -1 -1 ${yOffset/2} ${yOffset/2} h ${parent.x-item.x-(yOffset+treeScale)/2}` :
      item.parent && item.x > parent.x ?
      `M ${item.x} ${item.y+treeScale/2} v ${parent.y-item.y-(yOffset+treeScale)/2} a ${yOffset/2} ${yOffset/2} 0 0 1 -${yOffset/2} ${yOffset/2} h ${parent.x-item.x+(yOffset+treeScale)/2}` :
      `M ${item.x} ${item.y} v ${(yOffset)}`}
  })
  const litTips = result.filter(item => item.ids && item.ids.length)
  litTips.forEach(item => {
    const litBranches = tipToRoot(result, item)
    litBranches.forEach(item => {
      result.find(el=>el.node === item).lit = true
    })
  })
  console.log(result);
  return result
}

const tipToRoot = (arr, tip) => {
  const result = []
  while (tip.parent) {
    result.push(tip.node)
    tip = {...arr.find(el=>el.node == tip.parent)}
  }
  result.push(tip.node)
  console.log(result);
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
  console.log(tips.current);

  const treeScale = width/250

  useEffect(()=>{
    if (parsedTree.current.length && groups) {
      setLayout(getLayout(parsedTree.current, width, height*0.5, treeScale, maxDepth.current, groups[0], inners.current))
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
    console.log(grouped);
    const tipsWithIds = tips.current.map( x => Object.assign(x, {"ids":grouped[x.node]}))
    console.log(tipsWithIds);
    const miscIds = availableIds.filter(datum => !datum.group)
    setGroups([tipsWithIds, miscIds])
  },[chapter, id])


  if (layout){
    return (
      <>
        <Box sx={{pointerEvents:'all', backgroundImage: !dark && expand ? `linear-gradient(transparent, ${theme.colors.light})` : dark && expand ? `linear-gradient(transparent, ${theme.colors.dark})` : 'transparent', width:{width}, height: expand ? height*0.5 : height*0.25,  transition:'all 0.4s', zIndex:20}}>
          <Stage width={width} height={expand ? height*0.5 : height*0.25}>
            <Layer>
                <>
                  {layout.map(el => {
                    return(
                      <>
                        {/*<Path data={el.toParent} stroke={dark ? theme.colors.light : theme.colors.dark} strokeWidth={3} opacity={el.active ? 1 : 0.2}/>
                        <Group x={el.x} y={el.y} radius= {width/350} name={el.node} ids={el.ids} setId={setId} active={id}
                        position='right' theme={theme} dark={dark} width={width}/>*/}
                        <Node x={el.x} y={el.y} scale={treeScale} branch = {el.branch} name={el.node} textAlign='left' fontStyle='normal 700' theme={theme} dark={dark} width={width} lit={el.lit}/>
                        <Stack x={el.x} y={el.y} scale={treeScale} name={el.node} groupedIds={el.ids} setId={setId} activeId={id} textAlign='right' theme={theme} dark={dark} width={width}/>
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
