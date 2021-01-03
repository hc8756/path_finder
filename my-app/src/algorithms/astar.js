//for simplicity, we are setting distance property to f cost 
//this function returns closedlist (visited nodes)
//the open list is like a list of candidates for current node
export function astar(grid, startNode, finishNode){
    const openList=[];
    const closedList=[];
    startNode.distance= startNode.gCost+startNode.heuristic;
    openList.push(startNode);  
    
    while(!!openList.length){

        //find the node on openlist with smallest distance and set to current node
        sortNodesByDistance(openList);
        const currentNode=openList.shift();

        //if current node is a wall, just skip it
        if (currentNode.isWall) continue;
        //if current node distance is infinity, there is no path
        if(currentNode.distance===Infinity) return closedList;
        
        //set current node visited to true and push to closedlist and remove from openlist
        currentNode.isVisited=true;
        closedList.push(currentNode);

        //update the openlist with neighbors of the current node
        var neighbors=unvisitedNeighbors(currentNode,grid);
        for(let i=0;i<neighbors.length;i++){
            if(neighbors[i].previousNode===null || currentNode.gCost+1<neighbors[i].gCost ){
            neighbors[i].previousNode=currentNode;
            neighbors[i].gCost = currentNode.gCost + 1;
            neighbors[i].distance=neighbors[i].gCost+neighbors[i].heuristic;}

            if(!openList.includes(neighbors[i])){
                openList.push(neighbors[i]);
            }
            if(neighbors[i]==finishNode){
                return closedList;
            }
        }
    }
    return closedList;
}

//sort nodes in unvisited from smallest to largest from the start
function sortNodesByDistance(unvisitedNodes) {
unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}
  

//return unvisited neigbhbors of passed node
function unvisitedNeighbors(node,grid) {
    //get neighboring nodes that are unvisited
    const unvisitedNeighbors = [];
    //get col and row values of node
    const {col, row} = node;
    //push top,bottom,left,right negibors into neighbors array
    if (row > 0) unvisitedNeighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][col]);
    if (col > 0) unvisitedNeighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) unvisitedNeighbors.push(grid[row][col + 1]);

    return unvisitedNeighbors.filter(neighbor=>!neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the astar method above.
export function getNodesInShortestPathOrderB(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}