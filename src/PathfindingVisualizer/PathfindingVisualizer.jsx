import React, {Component} from 'react';

import './PathfindingVisualizer.css';
import Node from './Node'
import { dijkstra } from '../pathfinding algoritms/dijkstra';


let startNodeRow = 10;
let startNodeCol = 10;
let finishNodeRow = 10;
let finishNodeCol = 40;

export default class PathfinidingVisualizer extends Component{
    constructor(){
        super();
        this.state={
            grid:[],
            mouseIsPressed:false,
            nodeToChange:'',
            
        }
    }
    componentDidMount(){
          const grid=initializeGrid()
          this.setState({grid});
    }
   
    
    handleMouseDown(row,col,type){
        let newGrid
        switch (type) {
            case 'normal-node':
                newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'wall')
                this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'wall'})
                break;
            case 'wall':
                newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'normal-node')
                this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'normal-node'})
                break;
            case 'start':
                this.setState({mouseIsPressed:true, nodeToChange:'start'})
                
                break;
            case 'finish':
                this.setState({mouseIsPressed:true, nodeToChange:'finish'})
                break;
            default:
               
                break;
        }
   
    }
    handleMouseEnter(row,col,type){
        if(!this.state.mouseIsPressed)return
        if(type==='wall'||type==='normal-node'){
            let newGrid =getNewGridWithNewNodeType(this.state.grid,row,col,this.state.nodeToChange)
            this.setState({grid: newGrid});
        }  
    } 
    handleMouseUp(){
        this.setState({mouseIsPressed: false});
    }
    handleMouseLeave(row,col,type){
        let newGrid
        if(!this.state.mouseIsPressed)return
        if((type==='start'||type==='finish')&&this.state.nodeType!=='wall'){
            newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'normal-node')
            this.setState({grid: newGrid});
        }
           
    }
    animateDijkstra(visitedNodesInOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('visited')
              }, 10 * i);
        }
      }
    
  
    visualizeDijkstra(){
        const grid=this.state.grid
        const startNode=getNodeByType(grid,'start')
        const finishNode=getNodeByType(grid,'finish')
        const visitedNodesInOrder=dijkstra(grid,startNode,finishNode)
        this.animateDijkstra(visitedNodesInOrder)
    }
    visualizeAstar(){
        console.log('a')
    }
    visualizeSwarm(){
        console.log('a')
    }
    visualizeBFS(){
        console.log('a')
    }
    render(){        
        const {grid} = this.state;
        
        return(
          <div>
            
           
            <div className="header">
                <div className="logo">Pathfiniding Visualizer</div>
                <div className="dropdown">
                    <button className="dropbtn">Algoritms
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={() => this.visualizeDijkstra()}>Dijkstra</button>
                        <button onClick={() => this.visualizeAstar()}>A*</button>
                        <button>Swarm</button>
                        <button>Bidirectional swarm</button>
                        <button >DFS</button>
                    </div>
                   
                </div>
                <div className="dropdown">
                    <button className="dropbtn">Mazes
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button >Recursive maze 1</button>
                        <button >Recursive maze 2</button>
                        <button >Random Maze</button>
                    </div>
                </div>
                <button className="clear-board" >Clear Board</button>
  
            </div>
            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const{row,col,type,isVisited,distance}=node
                        
                        return (
                            <Node 
                            key={nodeIdx}
                            row={row}
                            col={col}
                            type={type}
                            //isWall={isWall}
                            isVisited={isVisited}
                            distance={distance}
                            onMouseDown={(row, col,type) => this.handleMouseDown(row, col,type)}
                            onMouseEnter={(row, col,type) => this.handleMouseEnter(row, col,type)} 
                            onMouseUp={() => this.handleMouseUp()} 
                            onMouseLeave={()=>this.handleMouseLeave(row,col,type)}
                            ></Node>
                        );
                        })}
                    </div>
                    );
                })}
                </div>
            </div>
        )
    }
   
}
const initializeGrid=()=>{
    const grid=[]
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
          currentRow.push(getNode(row,col));
        }
        grid.push(currentRow);
      }
      return grid
}
const getNode=(row,col)=>{

    const type=row===startNodeRow&&col===startNodeCol?'start':
    row===finishNodeRow&&col===finishNodeCol?'finish':'normal-node'

    return{
        row,
        col,
        type,
        isVisited: false,
        distance:Infinity,
    }
}

const getNewGridWithNewNodeType = (grid, row, col,newType) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    //isWall:!node.isWall,
    type:newType
  
    // isVisited:!isVisited
  };
  newGrid[row][col] = newNode;

  return newGrid;
};
const getNodeByType =(grid,givenType)=>{
  
    for (const row of grid) {
        for (const node of row) {
           if(node.type===givenType){
               return node;
           }
        }
      }
}
