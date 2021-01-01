import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderA} from '../algorithms/astar';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 8;
const START_NODE_COL = 19;
const FINISH_NODE_ROW = 18;
const FINISH_NODE_COL = 40;

export default class PathfindingVisualizer extends Component {
   //constructor where default state is specified: empty grid and mouseIsPressed set to false
    constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  //initializes state of grid
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }
  
  //methods that update grid state based on mouse actions
  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
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
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
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

  //method that is called in render
  //sets start node, finish node, visited nodes, and nodes in shortest path
  //calls animateAlgorithm method
  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    //how visited nodes and nodes in shortest path are retrieved is specified in dijkstra component
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  //method that is called in render
  //sets start node, finish node, visited nodes, and nodes in shortest path
  //calls animateAlgorithm method
  visualizeAStar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderA(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
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
            <li>Unweighted graph</li>
            <li>Fixed start and finish points</li>
            <li>Manhattan distance</li>
            <li>Create walls by clicking and dragging</li>
            <li>Refresh to repeat</li>
        </ul>

        {/*button that calls the visualizeDijkstra method*/}
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeAStar()}>
          A* Algorithm
        </button>
        <button onClick={() => this.visualizeDijkstra()}>
          DFS Algorithm
        </button>
        <button onClick={() => this.visualizeDijkstra()}>
          BFS Algorithm
        </button>
        {/*sets up grid in HTML so that it can be visualized with css*/}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
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
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    onOpen:false,
    isVisited: false,
    isWall: false,
    previousNode: null,
    heuristic: Math.abs(FINISH_NODE_ROW-row)+Math.abs(FINISH_NODE_COL-col),
    gCost:0,
  };
};

//method that helps update grid with wall creation
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};