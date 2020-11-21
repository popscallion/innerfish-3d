import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { Box } from 'rebass'
import { Stage, Layer, Circle, Text, Rect } from 'react-konva';
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
    function queryChildren(acc, item) {
        if (!item.children || !item.children.length) {
            return acc.concat(item.node)
        } else if (item.children && item.children.length) {
            return item.children.reduce(queryChildren, acc)
        }
        return acc;
    }
}

const Specimen = ({x, y, i=0, spc=0.3, radius=20, text="", uid=null, textfill=null, pathfill=null, stroke=null, textAlign='center', setId}) => {
  const [hover, setHover] = useState(false)
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
      <Circle x={x} y={((i+1)*spc+1)*y} fill={pathfill} stroke={stroke} radius={radius}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={uid ? handleClick : null}
              />
      <Text text={text} x={textAlign == 'left' ? x+radius*3 : x-radius*24} y={((i)*spc+1)*y} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} fill={textfill} visible={uid ? hover : true}/>
      {/*<Rect x={x-radius*10} y={((i)*spc+1)*y} align={textAlign} verticalAlign='middle' width={radius*20} height={radius*10} stroke={textfill} visible={true}/>*/}
    </>
  )
}

const Group = ({x, y, radius, name, ids, position, setId}) => {
  const children = ids ? ids.map((item,i) => {
    return <Specimen x={x} y={y} i={i} radius={radius} stroke='orange' text={item.scientific} uid={item.uid} textAlign={position} setId={setId}/>}) : null
  return (
    <>
      <Specimen x={x} y={y} radius={radius} i={-1} pathfill='grey' textfill='black' text={name} uid={null} textAlign={position}/>
      {children}
    </>
  )
}


const Tree = ({id, chapter}) => {
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const setId = useContext(SetIdContext)
  const [tree, setTree] = useState(null)
  const [groups, setGroups] = useState(null)
  const [offsets, setOffsets] = useState(null)

  useMemo(()=>{
    const phylogeny = [buildTree(treeData)]
    const [inners, tips, maxDepth] = getDepths(treeData, phylogeny)
    const activeId = data.find(datum => datum.uid === id)
    const availableIds = data.filter(datum => datum.chapter === chapter)
    const availableGroups = [...new Set (availableIds.map(id => id.group))]
    const idsPerGroup = availableGroups.map(group => availableIds.filter(item => item.group === group))
    const grouped = Object.fromEntries(availableGroups.map((_, i) => [availableGroups[i], idsPerGroup[i]]))
    const tipsWithIds = tips.map( x => Object.assign(x, {"ids":grouped[x.node]}))
    setTree({"inners":inners,"tips":tipsWithIds,"maxDepth":maxDepth})
    setGroups(grouped)
  },[])

  useEffect(()=>{
    const xOffset = width/(tree.tips.length)
    const yOffset = height*0.25/(tree.maxDepth)
    setOffsets({"x":xOffset,"y":yOffset})
  },[tree])

  if (offsets && offsets.x){
    return (
      <Box sx={{pointerEvents:'all'}}>
        <Stage width={width} height={height*0.25}>
          <Layer>
              {/*{tree.tips.map((item, i) => {
                return (
                  <>
                    <Circle x={offsets.x/2+i*offsets.x} y={offsets.y*3} stroke='blue' radius= {width/300}/>
                    <Text text={item.node} x={offsets.x/4+i*offsets.x} y={0} align='center' verticalAlign='bottom' width={offsets.x/2} height={offsets.y*2}/>
                  </>
                )
              })}*/}
              {tree.tips.map((item, i) => {
                return (
                  <Group x={offsets.x/2+i*offsets.x} y={offsets.y*3} radius= {width/350} name={item.node} ids={item.ids} setId={setId}
                  position={i <= Math.floor((tree.tips.length)/2) ? 'left' : 'right'}/>
              )})}
          </Layer>
        </Stage>
      </Box>
    )
  }
  else {
    return (
      <></>
    )
  }


}

export default Tree


// build list of nodes with no children

// JEN
//
// wnats structure
// publiah
// up to date on methods
// values communication and structure
// histology mammal morphometrics
//   likes haramyids myopatagium
// chicago with luo and angielcyzk
// dave polly indiana,david sargiz at yeale
