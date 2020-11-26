import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { useTheme } from 'emotion-theming'
import { Box, Flex } from 'rebass'
import { Stage, Layer, Circle, Text, Rect, RegularPolygon } from 'react-konva';
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

// const treeDataProper = [
//   { "node": "metazoa", "parent": null },
//   { "node": "non-bilaterian metazoans", "parent": "metazoa" },
//   { "node": "bilateria", "parent": "metazoa" },
//   { "node": "non-chordate bilaterians", "parent": "bilateria" },
//   { "node": "chordata", "parent": "bilateria" },
//   { "node": "non-cyclostome chordates", "parent": "chordata" },
//   { "node": "cyclostomata", "parent": "chordata" },
//   { "node": "non-gnathostome cyclostomes", "parent": "cyclostomata" },
//   { "node": "gnathostomata", "parent": "cyclostomata" },
//   { "node": "non-osteichthyan gnathostomes", "parent": "gnathostomata" },
//   { "node": "osteichthyes", "parent": "gnathostomata" },
//   { "node": "non-tetrapod osteichthyans", "parent": "osteichthyes" },
//   { "node": "tetrapoda", "parent": "osteichthyes" },
//   { "node": "non-amniote tetrapods", "parent": "tetrapoda" },
//   { "node": "amniota", "parent": "tetrapoda" },
//   { "node": "sauropsida", "parent": "amniota" },
//   { "node": "synapsida", "parent": "amniota" },
//   { "node": "reptiles", "parent": "sauropsida" },
//   { "node": "birds", "parent": "sauropsida" },
//   { "node": "non-primate mammals", "parent": "synapsida" },
//   { "node": "primates", "parent": "synapsida" },
// ]

const buildTree = (flat) => {
  let root
  const result = [...flat]
  result.forEach(el => {
    if (el.parent === null) {
      root = el;
      return;
    }
    const parentEl = result.find(item => item.node === el.parent)
    parentEl.children = [...(parentEl.children || []), el];
  });
  return root
}

const searchTree = (tree, value, key = 'node', reverse = false) => {
  const stack = [ tree[0] ]
  while (stack.length) {
    const node = stack[reverse ? 'pop' : 'shift']()
    if (node[key] === value) return node
    node.children && stack.push(...node.children)
  }
  return null
}

const getDepths = (flat, tree) => {
  let allNodes = []
  const queryParent = (current, starting, depth=0) => {
    if (current.parent) {
      const next = flat.find(el => el.node === current.parent)
      depth++
      if (next.parent) {
        return queryParent(next, starting, depth)
      } else {
        return {"node":starting.node,"depth":depth}
      }
    } else {
      return {"node":starting.node,"depth":depth}
    }
  }
  flat.forEach((item, i) => {
    const res = queryParent(item, item, 0)
    allNodes.push(res)
  });
  const maxDepth = allNodes.reduce((max, p) => p.depth > max ? p.depth : max, allNodes[0].depth)
  const inners = allNodes.flatMap(x => searchTree(tree, x.node).children ? x : [])
  const tips = allNodes.flatMap(x => searchTree(tree, x.node).children ? [] : x)
  return [inners, tips, maxDepth]
}

const getTips = (arr) => {
    return arr.reduce(queryChildren, [])
    function queryChildren(acc, val) {
        if (!val.children || !val.children.length) {
            return acc.concat(val.node)
        } else if (val.children && val.children.length) {
            return val.children.reduce(queryChildren, acc)
        }
        return acc;
    }
}
const getLayout = (obj) => {
  const array = Array.isArray(obj) ? obj : [obj];
  return array.reduce((acc, value) => {
    acc.push(value);
    if (value.children) {
      acc = acc.concat(getLayout(value.children));
      delete value.children;
    }
    return acc;
  }, []);
}
//
//
// const getLayout = (arr) => {
//   return arr.reduce((acc, val) => {
//     if (val.children){
//       console.log('has kids');
//     }
//   })
//   const layout = []
//   console.log('getting layout from');
//   console.log(arr);
//   arr.forEach( (item, index) => {
//     const res = []
//     if (item.children && item.children.length){
//       console.log('has kids');
//       item.children.forEach( (child, i) => {
//         res.push({'parent':child.parent,'child':child.node,'x':i*2,'y':index+1})
//       })
//     }
//     console.log('result is ');
//     console.log(res);
//     layout.push(res)
//   })
//   return layout
// }

const Node = ({x, y, i=0, spc=0.3, radius=20, text="", fontSize=12, lineHeight=1, uid=null, type=null, textfill=null, pathfill=null, stroke=null, opacity=1, textAlign='center', style='normal', letterSpacing=0, setId, active}) => {
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
      <Text text={text} x={textAlign == 'left' ? x+radius*2 : x-radius*22} y={((i)*spc+1)*y} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} lineHeight={lineHeight} fill={textfill} opacity={opacity} fontStyle={style} fontSize={fontSize} letterSpacing={0.5} visible={current ? true : hover ? true : false}/>
      {/*<Rect x={x-radius*10} y={((i)*spc+1)*y} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} stroke={textfill} visible={true}/>*/}
    </>
  )
}

const Group = ({x, y, radius, name, ids, position, setId, active, theme, dark}) => {
  const children = ids ? ids.map((item,i) => {
    return <Node x={x} y={y} i={i} radius={radius} stroke={dark ? theme.colors.light : theme.colors.royal} text={item.scientific ? item.scientific : item.common } textfill={dark ? theme.colors.light : theme.colors.dark} pathfill={dark ? theme.colors.ochre : theme.colors.amber} opacity={0.85} style={item.scientific ? 'italic' : 'normal'} uid={item.uid} type={item.type} textAlign={position} setId={setId} active={active}/>}) : null
  return (
    <>
      <Node x={x} y={y} radius={radius} i={-1} pathfill={dark ? theme.colors.light : theme.colors.dark} textfill={dark ? theme.colors.light : theme.colors.dark} opacity={0.85} text={name} uid={null} style='bold' textAlign={position}/>
      {children}
    </>
  )
}


const Tree = ({id, chapter, dark}) => {
  const theme = useTheme()
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setId = useContext(SetIdContext)
  const [phylogeny, setPhylogeny] = useState(null)
  const [tree, setTree] = useState(null)
  const [groups, setGroups] = useState(null)
  const [offsets, setOffsets] = useState(null)
  const [expand, setExpand] = useState(false)

  useMemo(()=>{
    const phylogeny = [buildTree(treeData)]
    console.log(phylogeny);
    const [inners, tips, maxDepth] = getDepths(treeData, phylogeny)
    setPhylogeny({"phylogeny":phylogeny, "inners":inners, "tips":tips, "maxDepth":maxDepth})
    console.log(inners);
  },[])

  useEffect(()=>{
    if(phylogeny){
      const test = getLayout(phylogeny.phylogeny)
      console.log(test);
    }
  },[phylogeny])

  useEffect(()=>{
    const activeId = data.find(datum => datum.uid === id)
    const availableIds = data.filter(datum => datum.chapter === chapter)
    const availableGroups = [...new Set (availableIds.map(id => id.group))]
    const idsPerGroup = availableGroups.map(group => availableIds.filter(item => item.group === group))
    const grouped = Object.fromEntries(availableGroups.map((_, i) => [availableGroups[i], idsPerGroup[i]]))
    const tipsWithIds = phylogeny.tips.map( x => Object.assign(x, {"ids":grouped[x.node]}))
    const miscIds = availableIds.filter(datum => !datum.group)
    setGroups([tipsWithIds, miscIds])
    console.log(tipsWithIds);
    console.log(miscIds);
  },[id, chapter])

  useEffect(()=>{
    const xOffset = width/(phylogeny.tips.length+1)
    const yOffset = height*0.25/(phylogeny.maxDepth)
    setOffsets({"x":xOffset,"y":yOffset})
    console.log(xOffset);
    console.log(yOffset);
  },[phylogeny, width, height])

  if (offsets){
    return (
      <>
        <Box sx={{position:'absolute', bottom:'0', pointerEvents:'all', backgroundImage: dark ? `linear-gradient(transparent, ${theme.colors.light25})` : `linear-gradient(transparent, ${theme.colors.dark25}, ${theme.colors.dark66})`, width:{width}, height: expand ? height*0.5 : height*0.25,  transition:'all 0.4s'}}>
          <Stage width={width} height={expand ? height*0.5 : height*0.25}>
            <Layer>
                <>
                  <Group x={offsets.x/2} y={offsets.y*3} radius= {width/350} name='' ids={groups[1]} setId={setId} active={id}
                  position='left' theme={theme} dark={dark}/>
                  {groups[0].map((item, i) => {
                    return (
                      <Group x={(i+1.5)*offsets.x} y={offsets.y*3} radius= {width/350} name={item.node} ids={item.ids} setId={setId} active={id}
                      position={i <= Math.floor((phylogeny.tips.length)/2) ? 'left' : 'right'} theme={theme} dark={dark}/>
                  )})}
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
          zIndex:'10',
          cursor:'pointer',
          pointerEvents:'all',
        }} onClick={()=>setExpand(!expand)}
        />
      </>
    )
  }
  else {
    return (
      <></>
    )
  }


}

export default Tree
