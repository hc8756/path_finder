//for simplicity, we are setting distance property to f cost 
//this function returns closedlist (visited nodes)
//the open list is like a list of candidates for current node
export function astar(grid, startNode, finishNode){
    const openList=[];
    const closedList=[];
    startNode.distance= startNode.gCost+startNode.heuristic;
    openList.push(startNode);  
    
    //var test= 10;
    //while(test===10){
    while(!!openList.length){
        //check if the finish node is in open list and end if true
        for(let i=0;i<openList.length;i++){
            openList[i].onOpen=true;
            if(openList[i].isFinish){
                return closedList;
            }
        }

        //find the node on openlist with smallest distance
        var currentNodeIndex=0;
        for(let i=0;i<openList.length;i++){
            if(openList[i].distance<openList[currentNodeIndex].distance){
                currentNodeIndex=i;
            }
        }
        //set to current node
        const currentNode=openList[currentNodeIndex];

        //if current node distance is infinity, there is no path
        if(currentNode.distance===Infinity) return closedList;
        //if current node is a wall, just skip it
        if (currentNode.isWall) continue;

        //set current node visited to true and push to closedlist
        currentNode.isVisited=true;
        closedList.push(currentNode);
        
        //update the openlist
        updateOpenList(currentNode,grid,openList);
        //update neighbors of current node
        updateNeighbors(currentNode,grid);
    }
    return closedList;
}

//looks around current node to add correct neighbors to open list
function updateOpenList(node,grid,list){
    //get col and row values of node
    const {col, row} = node;
    //push top,bottom,left,right negibors into open list
    if (row > 0 && grid[row - 1][col].onOpen===false) list.push(grid[row - 1][col]);
    if (row < grid.length - 1 && grid[row + 1][col].onOpen===false) list.push(grid[row + 1][col]);
    if (col > 0 && grid[row][col - 1].onOpen===false) list.push(grid[row][col - 1]);
    if (col < grid[0].length - 1 && grid[row][col + 1].onOpen===false) list.push(grid[row][col + 1]);

    //remove items from list that have been visited or is a wall
    for(let i=0;i<list.length;i++){
        if(list[i].isVisited || list[i].isWall){
            console.log("item has been removed");
            list.splice(i,1);
            i=i-1;
        }
    } 
}

//update properties of current node's neighbors
function updateNeighbors(node,grid) {
    //get neighboring nodes that are unvisited
    const unvisitedNeighbors = [];
    //get col and row values of node
    const {col, row} = node;
    //push top,bottom,left,right negibors into neighbors array
    if (row > 0) unvisitedNeighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][col]);
    if (col > 0) unvisitedNeighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) unvisitedNeighbors.push(grid[row][col + 1]);

    //get rid of neighbors that were visited or a wall
    for(let i=0;i<unvisitedNeighbors.length;i++){
        if(unvisitedNeighbors[i].isVisited===true || unvisitedNeighbors[i].isWall===true){
            unvisitedNeighbors.splice(i,1);
            i=i-1;
        }
    }

    //and for each of them, add 1 to their gcost (cost of u to v on unweighted graph) and update distance
    //and set current node to previous node 
    for (const neighbor of unvisitedNeighbors) {
        if(neighbor.previousNode===null||node.gCost+1<neighbor.gCost){   
            neighbor.previousNode = node;
            neighbor.gCost = node.gCost + 1;
            neighbor.distance=neighbor.gCost+neighbor.heuristic;
        }
    }
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