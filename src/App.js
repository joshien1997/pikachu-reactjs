import React, { Component } from 'react';
import './App.css';

function Square(props){
    return(
      <button 
      className = {props.value > 0 ? "square" : "non-square"}
      style = {props.selected ? {border: "3px solid red"}: null}  onClick={props.onClick} ><img src={'images/pokemon_'+props.value+'.png'} alt="poke" style={props.value === 0 ? {display: "none"} : null} /></button>
    );
}

const row = 9;
const col = 16;
const amount = 36;
var lines = [];
var newSquare;

class Board extends Component{
// debugger;
  
  renderSquare(i, j, selected){
    return(
      <Square
          value={this.props.square[i][j]}
          onClick={()=>this.props.onClick(i, j)}
      />
    );
  }

  render(){  
    return(
      <div>{
        [...Array(9).keys()].map(i => {
          return (
            <div className = "board-row" key={i}>
            {[...Array(16).keys()].map((square, j) => {
              let selected = true;
              if(this.props.square1 && this.props.square1.x === i && this.props.square1.y === j){
                selected = false;
              }if(this.props.square2 && this.props.square2.x === i && this.props.square2.y === j){
                selected = false;
              }
              return (<span key={`${i}_${j}`}>{this.renderSquare(i, j, selected)}</span>)
            })}
            </div>
          )
        })
        }
        </div>
    );
  }
}



class App extends Component{
  constructor(props){
    super(props);
    this.state={
      square: this.generateBoard(row, col, amount),
      square1: null, 
      square2: null,
      score: 0,
      mix_times: 5
    }
    this.hasLine = false;
    // this.doneLine = true;
  }

  generateBoard(row, col, amount){
    let arr = new Array(row);
    let temp = [];
    for(let i = 0; i < row; i++){
      arr[i] = new Array(col);
      let num ;

      for(let j = 0; j < col; j++){
        if(i === 0 || j === 0 || i === row - 1 || j === col - 1){
          num = 0;
          arr[i][j] = num;
          temp.push(num);
        }else{
          num = Math.floor((Math.random()* amount) + 1);
          arr[i][j] = num;
          temp.push(num); 
        }
      }
    }
    return arr
  }

  shouldComponentUpdate(){
    return true;
  }

  componentDidUpdate(){
    
    if(this.hasLine){
      lines.map((line)=>{
        return newSquare[line.x][line.y] = 0;
      })

      newSquare[this.state.square1.x][this.state.square1.y] = newSquare[this.state.square2.x][this.state.square2.y]  = 0;

      setTimeout(
        ()=>{
          this.setState({
            square: newSquare,
            square1: null,
            square2: null
          });
        }, 500
      );

      this.hasLine = false;
      lines = [];
      return;
    }

    if(this.state.square1 && this.state.square2){
      newSquare = this.state.square.slice();
      if(!this.isPair(this.state.square1, this.state.square2)){
        lines = [];        
        this.setState({
          square1: null,
          square2: null
        })
      }else{
        if(lines.length > 0){
          lines.map((line)=>{
            newSquare[line.x][line.y] = line.value;
          })
        }
        // newSquare[this.state.square1.x][this.state.square1.y] = newSquare[this.state.square2.x][this.state.square2.y] = 0;
        this.setState({
          // square: newSquare,
          score: this.state.score + 10
        });

        this.hasLine = true;
      }
      
      
    }

    console.log(this.state.square1);
    console.log(this.state.square2);
  }


  handleClick = (i, j)=>{
    // debugger;
    if(!this.state.square1){
      this.setState({
        square1:{x: i, y: j},
        valueSquare1: this.state.square[i][j],
      });
      return;  
    }

    if(!this.state.square2){
      this.setState({
        square2:{x: i, y: j},
        valueSquare2: this.state.square[i][j],
      });
    }
  }

  // In the same row
  checkLineX = (y1, y2, x) => {
    
    let minY = Math.min(y1, y2);
    let maxY = Math.max(y1, y2);
    let temp = [];

    for(let yi = minY + 1; yi < maxY; yi++){
      if(this.state.square[x][yi] !== 0){
        return false;
      }else{
        temp.push({x : x, y : yi, value : 'horizonal'});
      }
    }
    lines.push(...temp);
    return true;
  }
  
  //In the same col
  checkLineY = (x1, x2, y) => {
    
    let minX = Math.min(x1, x2);
    let maxX = Math.max(x1, x2);
    let temp = [];

    for(let xi = minX + 1; xi < maxX; xi++){
      if(this.state.square[xi][y] !== 0){
        return false;
      }else{
        temp.push({x : xi, y : y, value : 'vertical'});
        
      }
    }
    lines.push(...temp);
    return true;
  }
  
  checkRectX = (p1, p2) => {
    let pLeft = p1;
    let pRight = p2;
    // let temp = [];
    
    if(p1.y > p2.y){
      pLeft = p2;
      pRight = p1;
    }

    for(let yi = pLeft.y; yi < pRight.y - 1; yi++){
      if(this.checkLineX(pLeft.y, yi, pLeft.x) && this.checkLineY(pLeft.x, pRight.x , yi) && this.checkLineX(yi, pRight.y, pRight.x) && this.state.square[pLeft.x][yi] === 0 && this.state.square[pRight.x][yi] === 0){
        return true;
      }
    }
    return false;
  }

  checkRectY = (p1, p2) => {
    let pAbove = p1;
    let pBottom = p2;
    
    if(p1.x > p2.x){
      pAbove = p2;
      pBottom = p1;
    }

    for(let xi = pAbove.x; xi < pBottom.x - 1; xi++){
      if(this.checkLineY(pAbove.x, xi, pAbove.y) && this.checkLineX(pAbove.y, pBottom.y, xi) && this.checkLineY(xi, pBottom.x, pBottom.y) && this.state.square[xi][pAbove.y] === 0 && this.state.square[xi][pBottom.y] === 0){
        return true;
      }
    }
    return false;
  }

  checkMoreX = (p1, p2, pMaxX) => {
    let pAbove = p1;
    let pBottom = p2;

    if(p1.x > p2.x){
        pAbove = p2;
        pBottom = p1;
    }

    // Left
    for(let yi = pAbove.y; yi >= 0; yi--){
      if(this.checkLineX(pAbove.y, yi, pAbove.x) && this.checkLineY(pAbove.x, pBottom.x, yi) && this.checkLineX(yi, pBottom.y, pBottom.x)){
        return true;
      }
    }

    //Right
    for(let yi = pAbove.y; yi <= pMaxX; yi++){
      if(this.checkLineX(pAbove.y, yi, pAbove.x) && this.checkLineY(pAbove.x, pBottom.x, yi) && this.checkLineX(yi, pBottom.y, pBottom.x)){
        return true;
      }
    }
    

    return false;
  }

  checkMoreY = (p1, p2, pMaxY) => {
    let pLeft = p1;
    let pRight = p2;

    if(p1.y > p2.y){
        pLeft = p2;
        pRight = p1;
    }

    //Up
    for(let xi = pLeft.x; xi >= 0; xi--){
      if(this.checkLineY(pLeft.x, xi, pLeft.y) && this.checkLineX(pLeft.y, pRight.y, xi) && this.checkLineY(xi, pRight.x, pRight.y)){
        return true;
      }
    }

    //Down
    for(let xi = pLeft.x; xi <= pMaxY; xi++){
      if(this.checkLineY(pLeft.x, xi, pLeft.y) && this.checkLineX(pLeft.y, pRight.y, xi) && this.checkLineY(xi, pRight.x, pRight.y)){
        return true;
      }
    }

    return false;
  }


  isPair = (p1, p2) => {
    if(!p1 || !p2){
      throw Error('p1, p2 phai co gia tri')
    }

    let x1 = p1.x;
    let y1 = p1.y;
    
    let x2 = p2.x;
    let y2 = p2.y;

    if(this.state.square[x1][y1] !== this.state.square[x2][y2]){
      return false;
    }

    if(this.state.square1.x === this.state.square2.x && this.state.square1.y === this.state.square2.y){
      return false;
    }

    if(this.state.square[x1][y1] === this.state.square[x2][y2] === 0){
      return false;
    }

    if(x1 === x2 && this.checkLineX(y1, y2, x1)){
      return true;
    }

    if(y1 === y2 && this.checkLineY(x1, x2, y1)){
      return true;
    }

    if(x1 !== x2 && this.checkRectX(p1, p2)){
      return true;
    }

    if(x1 !== x2 && this.checkRectY(p1, p2)){
      return true;
    }

    if(this.checkMoreX(p1, p2, row)){
      return true;
    }

    if(this.checkMoreY(p1, p2, col)){
      return true;
    }

    return false;
  }

  MixPokemon = () =>{
    if(this.state.mix_times > 0){
      let arr1 = this.state.square;
      for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
          if(arr1[i][j] !== 0){
            let newSquare = arr1.slice();
            newSquare[i][j] = Math.floor(Math.random() * amount) + 1;
            this.setState({
              square: newSquare,
              mix_times: this.state.mix_times - 1
            });
          }
        }
      }
    }
  }

  render(){
    // debugger;
    return(
      <div className="game">
        <div className="game-board">
          <Board
          square = {this.state.square}
          onClick = {this.handleClick}
          square1 = {this.state.square1}
          square2 = {this.state.square2}
          />
        </div>
        <div> Score: {this.state.score}</div>
        <hr/>
        <button onClick={this.MixPokemon} id="mix_button">Mix</button>
        <p>Mix times: {this.state.mix_times}</p>
      </div>
    );
  }
}

export default App;

