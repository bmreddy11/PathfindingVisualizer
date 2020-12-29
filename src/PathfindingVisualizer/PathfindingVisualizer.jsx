import React, {Component} from 'react';

import './PathfindingVisualizer.css';
import Node from './Node'
import { dijkstra,getShortestDijkstraPath } from '../pathfinding algoritms/dijkstra';
import {astar ,getShortestAstarPath} from '../pathfinding algoritms/astar';
import {bfs,getShortestBFSPath} from '../pathfinding algoritms/bfs';
// import {dfs,getShortestDFSPath} from '../pathfinding algoritms/dfs';
import {swarm,getShortestSwarmPath} from '../pathfinding algoritms/swarm';


let startNodeRow = 10;
let startNodeCol = 10;
let finishNodeRow = 10;
let finishNodeCol = 40;

let algorithmRunning=false
let algorithmSpeed=10;

let wIsPressed=false

export default class PathfinidingVisualizer extends Component{
    constructor(){
        super();
        this.state={
            grid:[],
            mouseIsPressed:false,
            nodeToChange:''
            
        }
        document.addEventListener('keydown', function(event){
            if(event.key==="k"){
                wIsPressed=true
                // console.log(wIsPressed)
            }
          })
          document.addEventListener('keyup', function(event){
            if(event.key==="k"){
               wIsPressed=false
            //    console.log(wIsPressed)
            }
          })
      
    }
    componentDidMount(){
          const grid=initializeGrid()
          this.setState({grid});
    }
   
    
    handleMouseDown(row,col,type){
        let newGrid
        if(algorithmRunning)return
        
        switch (type) {
            case 'normal-node':
                if(wIsPressed){
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'weight')
                    this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'weight'})
                    break 
                }else{
                    newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'wall')
                    this.setState({grid: newGrid,mouseIsPressed:true,nodeToChange:'wall'})
                }
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
        if(algorithmRunning)return
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
        if((type==='start'||type==='finish')&&this.state.nodeToChange!=='wall'){
            newGrid=getNewGridWithNewNodeType(this.state.grid,row,col,'normal-node')
            this.setState({grid: newGrid});
        }
           
    }

    visualizeAlgorithm(algorithm) {
      
        switch (algorithm) {
            case 0:
                break;
            case 1:
            //this.visualizeDijkstra(startNode, finishNode);
                this.findPath(dijkstra,getShortestDijkstraPath);
            break;
            case 2:
                this.findPath(astar,getShortestAstarPath,);
            break;
            case 3:
                this.clearNodes(this.state.grid,'weight')
                this.findPath(bfs,getShortestBFSPath)
                break;
            case 4:
                this.findPath(swarm,getShortestSwarmPath);
                break;
          default:
              break
        }
        // algorithmRunning=false
      }
     
  
    findPath(algorithmCallback,getShortestPathCallback) {
        // this.setState({algorithmRunning:true})
        let startNode = getNodeByType(this.state.grid,'start')
        let finishNode =getNodeByType(this.state.grid,'finish')

       
        
        
        const visitedNodesInOrder = algorithmCallback(
            this.state.grid,
            startNode,
            finishNode,
        
        )
       
        const nodeInShortestPath=getShortestPathCallback(finishNode)
       
        this.animateAlgorithm(visitedNodesInOrder,nodeInShortestPath);
       // algorithmRunning=false
    }
     
    animateAlgorithm(visitedNodesInOrder,nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, algorithmSpeed * i);
                return;
                }
        const node = visitedNodesInOrder[i];
        const nodeComponent=document.getElementById(`node-${node.row}-${node.col}`)
          
          setTimeout(() => {
            nodeComponent.classList.add('visited')
          }, algorithmSpeed * i);
         
        }
      }
      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-shortest-path')
          }, 50 * i);
        }
      }
    clearNodes(grid,type){
        const newGrid=grid.slice()
        for (const row of newGrid) {
            for (const node of row) {
               console.log(node)
               if(node.type===type){
                   node.type="normal-node"
                  
               }
            }
          }
        this.setState({grid:newGrid})
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
                        <button onClick={() => this.visualizeAlgorithm(1)}>Dijkstra</button>
                        <button onClick={() => this.visualizeAlgorithm(2)}>A*</button>
                        <button onClick={() => this.visualizeAlgorithm(3)}>BFS</button>
                        <button onClick={() => this.visualizeAlgorithm(4)}>Swarm</button>
                        <button>Bidirectional swarm</button>
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
                <div className="dropdown">
                <button className="dropbtn">Speed
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <button onClick={()=>changeAlgoritmSpeed(125)}>Slow</button>
                        <button onClick={()=>changeAlgoritmSpeed(50)}>Medium</button>
                        <button onClick={()=>changeAlgoritmSpeed(10)}>Fast</button>
                    </div>
                </div>
                <button className="clear-walls" onClick={()=>this.clearNodes(this.state.grid,'wall')}>Clear Walls </button>
                <button className="clear-walls" onClick={()=>this.clearNodes(this.state.grid,'weight')}>Clear Weights </button>
                {/* <button className="clear-path" onClick={()=>this.resetBoard(this.state.grid)}>Reset Board </button> */}
            </div>
            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const{row,col,type,weightValue,isVisited,distance,gScore,fScore,hScore,closed}=node
                        
                        return (
                            <Node 
                            key={nodeIdx}
                            row={row}
                            col={col}
                            type={type}
                            //isWall={isWall}
                            weightValue={weightValue}
                            isVisited={isVisited}
                            distance={distance}
                            gScore={gScore}
                            fScore={fScore}
                            hScore={hScore}
                            closed={closed}
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
        weightValue:1,
        isVisited: false,
        distance:Infinity,//djkstra
        gScore:Infinity,//astar
        fScore:Infinity,//astar
        hScore:null,//astar
        closed:false
    }
}

const getNewGridWithNewNodeType = (grid, row, col,newType) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  let newWeightValue=newType==='weight'? 15:1;
  const newNode = {
    ...node,
    //isWall:!node.isWall,
    type:newType,
    weightValue:newWeightValue
    // isVisited:!isVisited
  };
  newGrid[row][col] = newNode;

  return newGrid;
};
//This function iterates trought the array and reuturns a node with a given type
const getNodeByType =(grid,givenType)=>{
  
    for (const row of grid) {
        for (const node of row) {
           if(node.type===givenType){
               return node;
           }
        }
      }
}


function changeAlgoritmSpeed(speed){
    algorithmSpeed=speed
}