import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { useTheme } from 'emotion-theming'
import { Box, Flex } from 'rebass'
import { Stage, Layer, Circle, Text, Rect, RegularPolygon, Path} from 'react-konva';
import { useWindowSize } from '@react-hook/window-size';
import { DataContext, SetIdContext } from '../Context'

const treeData = [
  { "node": "metazoa", "parent": null },
  { "node": "non-bilaterian metazoans", "parent": "metazoa" },
  { "node": "bilateria", "parent": "metazoa" },
  { "node": "non-chordate bilaterians", "parent": "bilateria" },
  { "node": "chordata", "parent": "bilateria" },
  { "node": "non-cyclostome chordates", "parent": "chordata" },
  { "node": "cyclostomata", "parent": "chordata" },
  { "node": "non-gnathostome cyclostomes", "parent": "cyclostomata" },
  { "node": "gnathostomata", "parent": "cyclostomata" },
  { "node": "non-osteichthyan gnathostomes", "parent": "gnathostomata" },
  { "node": "osteichthyes", "parent": "gnathostomata" },
  { "node": "Bony Fish", "parent": "osteichthyes" },
  { "node": "tetrapoda", "parent": "osteichthyes" },
  { "node": "non-amniote tetrapods", "parent": "tetrapoda" },
  { "node": "amniota", "parent": "tetrapoda" },
  { "node": "sauropsida", "parent": "amniota" },
  { "node": "synapsida", "parent": "amniota" },
  { "node": "reptiles", "parent": "sauropsida" },
  { "node": "birds", "parent": "sauropsida" },
  { "node": "non-primate mammals", "parent": "synapsida" },
  { "node": "Primates", "parent": "synapsida" },
]

const Node = ({x, y, i=0, spc=0.3, radius=20, text="", fontSize=16, lineHeight=1, uid=null, type=null, textfill=null, pathfill=null, stroke=null, opacity=1, textAlign='center', style='normal', letterSpacing=2, setId, active, width}) => {
  const [hover, setHover] = useState(false)
  const [current, setCurrent ] = useState(false)

  useEffect(()=>{
    if (active !== uid){
      setCurrent(false)
    } else {
      setCurrent(true)
    }
  },[active])

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
      {type === 'Video' && <RegularPolygon x={x} y={((i+1)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius} sides={3} rotation={90} opacity={opacity}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={uid ? handleClick : null}
              />}
      {type === 'Image' && <RegularPolygon x={x} y={((i+1)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius*1.25} sides={4} rotation={45} opacity={opacity}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={uid ? handleClick : null}
              />}
      {type === 'Model' && <Circle x={x} y={((i+1)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius} opacity={opacity}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={uid ? handleClick : null}
              />}
      {!type && <Circle x={x} y={((i+1)*spc+1)*y} fill={uid && !current ? null : pathfill} stroke={stroke} radius={radius} opacity={opacity}
      onMouseEnter={hoverOn}
      onMouseLeave={hoverOff}
      />}
      <Text text={text} x={x-radius*22} y={y-radius*3} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} lineHeight={lineHeight} fill={textfill} opacity={opacity} fontStyle={style} fontSize={fontSize} letterSpacing={0.5} visible={current ? true : hover ? true : false}/>
      {/*<Rect x={x-radius*22} y={y-radius*5} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} stroke={textfill} visible={true}/>*/}
    </>
  )
}

const Group = ({x, y, radius, name, ids, position, setId, active, theme, dark, width}) => {
  const children = ids ? ids.map((item,i) => {
    return <Node x={x} y={y} i={i} radius={radius} stroke={dark ? theme.colors.light : theme.colors.royal} text={item.scientific ? item.scientific : item.common } textfill={dark ? theme.colors.light : theme.colors.dark} pathfill={dark ? theme.colors.ochre : theme.colors.amber} opacity={0.85} style={item.scientific ? 'italic' : 'normal'} uid={item.uid} type={item.type} textAlign={position} setId={setId} active={active} width={width}/>}) : null
  return (
    <>
      <Node x={x} y={y} radius={radius} i={-1} pathfill={dark ? theme.colors.light : theme.colors.dark} textfill={dark ? theme.colors.light : theme.colors.dark} opacity={0.85} text={name} uid={null} style='bold' textAlign={position} width={width}/>
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

const getLayout = (parsed, width, height, maxDepth, tips, inners) => {
  const nodes = []
  const xOffset = width/(tips.length+1)
  const yOffset = height/(maxDepth+2)
  tips.forEach((el, i) => {
    const xPos = xOffset*(i+1)
    const yPos = yOffset
    const update = {
        node: el.node,
        x: xPos,
        y: yPos,
        parent:el.parent,
    }
    nodes.push(update)
  })
  for (let i=maxDepth-1 ; i>=0; i--){
    const nodesAtDepth = inners.filter(item => item.depth === i)
    nodesAtDepth.forEach((el, it) => {
      const update = {
        node:el.node,
        x: nodes.filter(item=>el.children.map(child=>child.node).includes(item.node)).reduce((acc, val, _, {length}) => {return acc+val.x / length}, 0),
        y: height-yOffset*(i+1),
        parent:el.parent,
        toParent: `v -${yOffset/2} h -${xOffset*it} v -${yOffset/2}`,
      }
      console.log(update);
      nodes.push(update)
    })
  }
  const result = nodes.map(item => {
    const parent = nodes.find(el => el.node === item.parent)
    console.log(parent);
    console.log(item);
    return {...item, toParent: item.parent ? `M ${item.x} ${item.y} v ${(parent.y-item.y)} h ${parent.x-item.x}` : null}
  })
  console.log(nodes);
  console.log(result);
  return result


}


// const getLayout = (parsed, width, height, maxDepth, tipNames) => {
//   const result = []
//   const xOffset = width/(tipNames.length+1)
//   const yOffset = height/(maxDepth+1)
//   for (let i=0 ; i<maxDepth+1; i++){
//     const nodesAtDepth = parsed.filter(item => item.depth === i)
//     nodesAtDepth.forEach((el, it) => {
//       result.push(
//         {node:el.node,
//           // x: el.parent ? result.find(item => item.node === el.parent).x+xOffset*it+xOffset/2 : xOffset*(it+0.5),
//           x: el.parent ? result.find(item => item.node === el.parent).x + -xOffset/3 + xOffset*it : xOffset*(it+0.5),
//           y: el.children.length ? height-yOffset*(i+0.5) : yOffset*0.5,
//           parent:el.parent,
//           toParent: `v -${yOffset/2} h -${xOffset*it} v -${yOffset/2}`,
//         }
//       )
//     })
//   }
//   return result
// }


const Tree = ({id, chapter, dark}) => {
  const theme = useTheme()
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setId = useContext(SetIdContext)

  const [layout, setLayout] = useState(null)

  const [phylogeny, setPhylogeny] = useState(null)
  const [tree, setTree] = useState(null)
  const [groups, setGroups] = useState(null)
  const [offsets, setOffsets] = useState(null)
  const [expand, setExpand] = useState(false)

  const parsedTree = useRef(parseTree(treeData))


  useEffect(()=>{
    if (parsedTree.current.length) {
      const maxDepth = getMaxDepth(parsedTree.current)
      const tips = parsedTree.current.filter(item => !item.children.length)
      const inners = parsedTree.current.filter(item => item.children.length)
      setLayout(getLayout(parsedTree.current, width, height*0.5, maxDepth, tips, inners))
    }
  },[width,height])

  useEffect(()=>{
    console.log(layout);
  },[layout])


  //
  // useEffect(()=>{
  //   const activeId = data.find(datum => datum.uid === id)
  //   const availableIds = data.filter(datum => datum.chapter === chapter)
  //   const availableGroups = [...new Set (availableIds.map(id => id.group))]
  //   const idsPerGroup = availableGroups.map(group => availableIds.filter(item => item.group === group))
  //   const grouped = Object.fromEntries(availableGroups.map((_, i) => [availableGroups[i], idsPerGroup[i]]))
  //   const tipsWithIds = phylogeny.tips.map( x => Object.assign(x, {"ids":grouped[x.node]}))
  //   const miscIds = availableIds.filter(datum => !datum.group)
  //   setGroups([tipsWithIds, miscIds])
  //   console.log(tipsWithIds);
  //   console.log(miscIds);
  // },[id, chapter])


  if (layout && layout.length){
    return (
      <>
        <Box sx={{bottom:'0', pointerEvents:'all', backgroundImage: dark ? `linear-gradient(transparent, ${theme.colors.light25})` : `linear-gradient(transparent, ${theme.colors.dark25}, ${theme.colors.dark66})`, width:{width}, height: expand ? height*0.5 : height*0.25,  transition:'all 0.4s', zIndex:20}}>
          <Stage width={width} height={expand ? height*0.5 : height*0.25}>
            <Layer>
                <>
                  {layout.map(el => {
                    return(
                      <>
                        <Group x={el.x} y={el.y} radius= {width/350} name={el.node} ids={[]} setId={setId} active={id}
                        position='right' theme={theme} dark={dark} width={width}/>
                        <Path data={el.toParent} stroke='black' strokeWidth={1}/>
                      </>
                    )

                  })}

                </>
            </Layer>
          </Stage>
        </Box>
        <Box sx={{
          bg:'red', width:'5vmin', height:'5vmin',
          position:'absolute',
          bottom:'0',
          left:'50vw',
          right:'50vw',
          zIndex:'25',
          cursor:'pointer',
          pointerEvents:'all',
        }} onClick={()=>setExpand(!expand)}
        />
      </>
  )}
  else {
    return (
      <></>
    )
  }


}

export default Tree
