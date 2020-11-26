
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


var parseTree = (flat) => {
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

var getMaxDepth = parsed => {
  return parsed.reduce((max, val)=> val.depth > max ? val.depth : max, parsed[0].depth)
}

var getLayout = (parsed, width, height) => {
  const result = []
  for (let i=0 ; i<maxDepth+1; i++){
    const nodesAtDepth = parsed.filter(item => item.depth === i)
    nodesAtDepth.forEach((el, it) => {
      result.push(
        {node:el.node,
          x: el.parent ? result.find(item => item.node === el.parent).x+xOffset*it : xOffset*it,
          y:height-yOffset*i,
          parent:el.parent,
          toParent: `v -${yOffset/2} h -${xOffset*it} v -${yOffset/2}`,
        }
      )
    })
  }
  return result
}




var parsedTree = parseTree(treeData)
var maxDepth = getMaxDepth(parsedTree)

var tipNames = parsedTree.filter(item => !item.children.length).map(item => item.node)
var innerNames = parsedTree.filter(item => item.children.length).map(item => item.node)


var width = 1000
var height = 300
var xOffset = width/(tipNames.length+1)
var yOffset = height/(maxDepth)

var layout = getLayout(parsedTree,width,height)
