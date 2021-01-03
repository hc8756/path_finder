export function dfs(grid, startNode, finishNode){
    const stack = [];
    const visited=[];
    stack.push(startNode);

    while(!!stack.length){
        //current node is top of the stack
        const currentNode=stack.pop();
        if (currentNode.isWall) continue;
        //mark as visited and add to the visited array
        visited.push(currentNode);
        currentNode.isVisited=true;
        //end if current node is the finish node
        if(currentNode===finishNode) return visited;

        //get neighbors of the current node
        const neighbors= getNeighbors(currentNode,grid);
        if(neighbors.length===0){
            return visited;
        }
        //for each neighbor,
        for(let i=0;i<neighbors.length;i++){
            //recursively call the dfs function
            dfs(grid,neighbors[i],finishNode);
        }
    }
    return visited;
}

//looks around passed node and return neighbors after setting node to parent
function getNeighbors(node,grid){
    const list=[];
    //get col and row values of node
    const {col, row} = node;
    //push top,bottom,left,right negibors into open list
    if (row > 0) list.push(grid[row - 1][col]);
    if (row < grid.length - 1) list.push(grid[row + 1][col]);
    if (col > 0) list.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) list.push(grid[row][col + 1]);

    //remove items from list that is a wall or visited
    for(let i=0;i<list.length;i++){
        if(list[i].isVisited){
            list.splice(i,1);
            i=i-1;
        }
    } 
    //set node to each neighbor parent
    for(let i=0;i<list.length;i++){
        list[i].previousNode=node;
    } 
    return list;
}


// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the astar method above.
export function getNodesInShortestPathOrderC(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
