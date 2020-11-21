import React, {useContext, useEffect, useMemo, useState, useRef} from 'react';
import { Box } from 'rebass'
import { Stage, Layer, Circle, Text } from 'react-konva';
import { useWindowSize } from '@react-hook/window-size';
import { DataContext } from '../Context'

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
  { "node": "non-tetrapod osteichthyans", "parent": "osteichthyes" },
  { "node": "tetrapoda", "parent": "osteichthyes" },
  { "node": "non-amniote tetrapods", "parent": "tetrapoda" },
  { "node": "amniota", "parent": "tetrapoda" },
  { "node": "sauropsida", "parent": "amniota" },
  { "node": "synapsida", "parent": "amniota" },
  { "node": "reptiles", "parent": "sauropsida" },
  { "node": "birds", "parent": "sauropsida" },
  { "node": "non-primate mammals", "parent": "synapsida" },
  { "node": "primates", "parent": "synapsida" },
]

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

const Tree = ({id, chapter}) => {
  const [width, height] = useWindowSize()
  const data = useContext(DataContext)
  const activeId = data.find(datum => datum.uid === id)
  const availableIds = data.filter(datum => datum.chapter === chapter)
  const availableGroups = [...new Set (availableIds.map(id => id.group))]
  console.log(availableIds);
  console.log(availableGroups);
  const [tree, setTree] = useState(null)
  const [offsets, setOffsets] = useState(null)

  useMemo(()=>{
    const phylogeny = [buildTree(treeData)]
    const [inners, tips, maxDepth] = getDepths(treeData, phylogeny)
    setTree({"inners":inners,"tips":tips,"maxDepth":maxDepth})
    console.log("tree ready");
  },[])

  useEffect(()=>{
    const xOffset = width/(tree.tips.length)
    const yOffset = height*0.25/(tree.maxDepth)
    setOffsets({"x":xOffset,"y":yOffset})
    console.log(offsets);
    console.log("offsets ready");
  },[tree])
  console.log(tree);

  if (offsets && offsets.x){
    return (
      <Box sx={{pointerEvents:'all'}}>
        <Stage width={width} height={height*0.25}>
          <Layer>
              {tree.tips.map((item, i) => {
                return (
                  <>
                    <Circle x={offsets.x/2+i*offsets.x} y={offsets.y*3} stroke='blue' radius= {width/300}/>
                    <Text text={item.node} x={offsets.x/4+i*offsets.x} y={0} align='center' verticalAlign='bottom' width={offsets.x/2} height={offsets.y*2}/>
                  </>
                )
              })}
              {availableIds.map((item, i) => {
                return (
                  <>
                    <Circle x={offsets.x/2+i*offsets.x} y={offsets.y*3} stroke='blue' radius= {width/300}/>

                  </>
                )
              })

              }
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
