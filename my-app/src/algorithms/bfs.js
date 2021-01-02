//function is passed grid with start and finish nodes
export function bfs(grid, startNode, finishNode) {
    //visited nodes initially set to empty array 
    const visitedNodesInOrder = [];
    //set the startNode distance from infinity to zero
    startNode.distance = 0;
    //fill unvisted nodes with all the nodes on grid
    const unvisitedNodes = getAllNodes(grid);
    //while unvisited nodes exist
    while (!!unvisitedNodes.length) {

      //find the node with the shortest distance
      sortNodesByDistance(unvisitedNodes);
      //the shift function removes and the returns the first item of the array
      const closestNode = unvisitedNodes.shift();

      //if it is a wall, skip
      if (closestNode.isWall) continue;

      //if the closest node is at a distance of infinity,
      //we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      //if the closest node is visited- push it to the end of visited nodes
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      //if the closest node is the finish node, stop.
      if (closestNode === finishNode) return visitedNodesInOrder;
      
      //update visited neighbors
      updateUnvisitedNeighbors(closestNode, grid);
    }
  }
  
  //sort nodes in unvisited from smallest to largest from the start
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  //update properties of nodes in unvisted nodes array
  function updateUnvisitedNeighbors(node, grid) {
    //get neighboring nodes that are unvisited
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    //and for each of them, add 1 to their distance (cost of u to v on unweighted graph)
    //and set current node to previous node 
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
  }
  
  //get the neighbors of the node from a grid and return in array
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    //get col and row values of node
    const {col, row} = node;
    //push top,bottom,left,right negibors into neighbors array
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    //only return unvisited neighbors
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  //self explanatory
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrderD(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }