import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrderA} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderB} from '../algorithms/astar';
import {dfs, getNodesInShortestPathOrderC} from '../algorithms/dfs';
import {bfs, getNodesInShortestPathOrderD} from '../algorithms/bfs';
import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
   //constructor where default state is specified: empty grid and mouseIsPressed+weightsOn set to false
    constructor() {
    super();
    this.state = {
      buttonsDisabled:false,
      START_NODE_ROW:0,
      START_NODE_COL:0,
      FINISH_NODE_ROW:19,
      FINISH_NODE_COL:49,
      grid: [],
      mouseIsPressed: false,
      weightsOn: false,
    };
    this.setStartRow = this.setStartRow.bind(this);
    this.setStartCol = this.setStartCol.bind(this);
    this.setFinishRow = this.setFinishRow.bind(this);
    this.setFinishCol = this.setFinishCol.bind(this);

  }

  //initializes state of grid
  componentDidMount() {
    const grid = getInitialGrid();
    window.addEventListener('keyDown', this.handleKeyDown.bind(this));
    this.setState({grid});
  }
  

  //methods that update grid state based on mouse actions
  handleMouseDown(row, col) {
    if (!this.state.weightsOn){
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true, weightsOn:false});
    }
    else {
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true, weightsOn:true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;

    else if(!this.state.weightsOn){
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }
    else if (this.state.weightsOn){
        const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }
    
  } 

  handleMouseUp() {
    this.setState({mouseIsPressed: false,});
  }
  
  handleKeyDown(){
      if(this.state.weightsOn){this.setState({weightsOn: false});}
      else{this.setState({weightsOn: true});}
  }

  //method to animate algorithms
  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    //if all visited nodes have been animated, animate the shortest path and finish
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      //else, set visitedNodesInOrder[i] className to node-visited so that css animation can be applied
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if(!node.isWeighted){document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';}
        
      }, 10 * i);
    }
  }

  //method to animate shortest path
  //for each node in shortst path, set className to node-shortest-path so that css animation can be applied
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  //methods called in render
  //sets start node, finish node, visited nodes, and nodes in shortest path
  //calls animateAlgorithm method
  visualizeDijkstra() {
    const {grid} = this.state;
    this.setState({buttonsDisabled:true});
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderA(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    const {grid} = this.state;
    this.setState({buttonsDisabled:true});
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderB(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDFS() {
    const {grid} = this.state;
    this.setState({buttonsDisabled:true});
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderC(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    const {grid} = this.state;
    this.setState({buttonsDisabled:true});
    const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode = grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderD(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  refresh(){
    window.location.reload();
  }
  setStartRow(event) {
    if(event.target.value>=0 && event.target.value<20){
      this.setState({START_NODE_ROW: Number(event.target.value).toString()});
      getNewGridWithStart(this.state.grid,Number(event.target.value).toString(), this.state.START_NODE_COL);
    }    
  }

  setStartCol(event) {
    if(event.target.value>=0 && event.target.value<50){
      this.setState({START_NODE_COL: Number(event.target.value).toString()});
      getNewGridWithStart(this.state.grid,this.state.START_NODE_ROW,Number(event.target.value).toString());
    }    
  }

  setFinishRow(event) {
    if(event.target.value>=0 && event.target.value<20){
      this.setState({FINISH_NODE_ROW: Number(event.target.value).toString()});
      getNewGridWithFinish(this.state.grid,Number(event.target.value).toString(),this.state.FINISH_NODE_COL);
    }    
  }

  setFinishCol(event) {
    if(event.target.value>=0 && event.target.value<50){
      this.setState({FINISH_NODE_COL: Number(event.target.value).toString()});
      getNewGridWithFinish(this.state.grid,this.state.FINISH_NODE_ROW,Number(event.target.value).toString());
    }    
  }

  //this is like the main method for jsx
  //basically HTML with JavaScript in curly braces
  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <h1>Pathfinding Algorithms</h1>
        <h2>Details:</h2>
        <ul>
            <li>Manhattan distance, no diagonals</li>
            <li>BFS and DFS algorithms will disregard node weight</li>
            <li>Create walls or weights by clicking and dragging</li>
        </ul>

        {/*button that calls the visualizeDijkstra method*/}
        <button disabled={this.state.buttonsDisabled} onClick={() => this.handleKeyDown()}>
          Walls/Weights Toggle
        </button>
        <button disabled={this.state.buttonsDisabled} onClick={() => this.visualizeDijkstra()}>
          Dijkstra's Algorithm
        </button>
        <button disabled={this.state.buttonsDisabled} onClick={() => this.visualizeAStar()}>
          A* Algorithm
        </button>
        <button disabled={this.state.buttonsDisabled} onClick={() => this.visualizeDFS()}>
          DFS Algorithm
        </button>
        <button disabled={this.state.buttonsDisabled} onClick={() => this.visualizeBFS()}>
          BFS Algorithm
        </button>
        <button onClick={() => this.refresh()}>
          Reset
        </button>

        <div className="input">
          <label>Starting Row (0~19): </label>
          <input type="number" onChange={this.setStartRow} value={ Number(this.state.START_NODE_ROW).toString()} />
          <label>Starting Column (0~49): </label>
          <input type="number" onChange={this.setStartCol} value={ Number(this.state.START_NODE_COL).toString()} />
          
          <label>Finishing Row (0~19): </label>
          <input type="number" onChange={this.setFinishRow} value={ Number(this.state.FINISH_NODE_ROW).toString()} />
          <label>Finishing Column (0~49): </label>
          <input type="number" onChange={this.setFinishCol} value={ Number(this.state.FINISH_NODE_COL).toString()} />

        </div>

        {/*sets up grid in HTML so that it can be visualized with css*/}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall,isWeighted} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

//method that returns grid after setting it up with 20 rows and 50 columns of nodes
//with each node being passed a row and column value
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

//method that creates and returns a node given a row and column value
//checks of node is start or finish node
//other properties like distance, isVisited, isWall, and previous node are given default values
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 0 && col === 0,
    isFinish: row === 19 && col === 49,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    isWeighted: false,
    previousNode: null,
    heuristic: Math.abs(19-row)+Math.abs(49-col),
    gCost:0,
  };
};

//method that helps update grid with wall creation
//walls cannot be created on start and finish points
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  if(!newGrid[row][col].isStart && !newGrid[row][col].isFinish){
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
    isWeighted: false,
  };
  newGrid[row][col] = newNode;
 }
  return newGrid;
};

//method that helps update grid with weight
const getNewGridWithWeightToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWeighted: !node.isWeighted,
      isWall: false,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };


  //methods that update starting and finishing points
  const getNewGridWithStart = (grid, sRow, sCol) => {
    const newGrid = grid.slice();
    if(sRow>=0 && sRow<20 && sCol>=0 && sCol<50){
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        const nodeR=newGrid[row][col];
        const currentNode = {
          ...nodeR,
          isStart: false,
        };
        newGrid[row][col]=currentNode;
      }
    }
    const node = newGrid[sRow][sCol];
    const newNode = {
      ...node,
      isWall: false,
      isStart: true,
    };
    newGrid[sRow][sCol] = newNode;}
    return newGrid;
  };

  const getNewGridWithFinish = (grid, fRow, fCol) => {
    const newGrid = grid.slice();
    if(fRow>=0 && fRow<20 && fCol>=0 && fCol<50){

    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 50; col++) {
        const nodeR=newGrid[row][col];
        const currentNode = {
          ...nodeR,
          isFinish: false,
        };
        newGrid[row][col]=currentNode;
      }
    }

    const node = newGrid[fRow][fCol];
    const newNode = {
      ...node,
      isWall: false,
      isFinish: true,
    };
    newGrid[fRow][fCol] = newNode;
  
    //recalculate heuristics
    
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 50; col++) {
          const nodeH=newGrid[row][col];
          const newHNode = {
            ...nodeH,
            heuristic: Math.abs(fRow-row)+Math.abs(fCol-col),
          };
          newGrid[row][col]=newHNode;
        }
      }
  }
    return newGrid;
  };
