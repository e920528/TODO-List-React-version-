import React, { Component } from 'react';
import './App.css';


class App extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      list: [],
      unfinishNum: 0,
      finishNum: 0,
      nowDisplay: []
    }
  }
  render() {
    //list to show
    let listArray = [];
    for (let i = 0; i < this.state.list.length; i++)
        listArray.push(this.renderList(i));
    //item to show
    let itemArray = [];
    if(typeof this.state.nowDisplay !== 'undefined' && this.state.nowDisplay.length > 0){
      if(typeof this.state.nowDisplay[0].items !== 'undefined' && this.state.nowDisplay[0].items.length > 0)
        for (let i = 0; i < this.state.nowDisplay[0].items.length; i++) {
          itemArray.push(this.renderItem(i));
        }
    }
    
    return (
      <span>
        <div className="sidenav">
        <p>
          List
          <span className="finish">{this.state.finishNum}</span>
          <span className="unfinish">{this.state.unfinishNum}</span>
        </p>
        {listArray}
        </div>
  
        <div id="myDIV" className="main header">
          <h2>TODO List</h2>
          <input type="text" id="NewList" placeholder="List Title"/>
          <button onClick={() => this.newList()} className="addBtn" id="addButton">Add</button>
        </div>
        <div className="item-header main">
          {this.renderItemHeader()}
        </div>
        <div className="main">
          <ul id="myUL">
            {itemArray}
          </ul> 
        </div>
      </span>
      
   
    );
  }
  renderItemHeader(){
    if(typeof this.state.nowDisplay !== 'undefined' && this.state.nowDisplay.length > 0)
      return(
        <div>
          <h2>{this.state.nowDisplay[0].title}</h2>
          <input type="text" id="NewItem" placeholder="Item Title"/>
          <button onClick={() => this.newItem()} className="addBtn" id="addButton">Add</button>
        </div>
        
      )
  }
  updateNum() {
    let copy = this.state.list;
    let uNum = 0;
    let fNum = 0;
    for (let i = 0; i < copy.length; i++) {
      copy[i].finishNum = 0;
      copy[i].unfinishNum = 0;
      for(let j = 0; j < copy[i].items.length; j++){
        if(copy[i].items[j].status){
          copy[i].finishNum++;
          fNum++;
        }
        else{
          copy[i].unfinishNum++;
          uNum++;
        }
      }   
    }
    this.setState({
      list: copy,
      unfinishNum: uNum,
      finishNum: fNum
    })

  }
  newItem() {
    let title = document.getElementById('NewItem').value;
    let newItem = new todoItem(title);
    let index = this.state.nowDisplay[1];
    let newList = this.state.nowDisplay[0];
    newList.items.push(newItem);
    let copy = this.state.list.slice();
    copy[index] = newList;
    let newDisplay = [];
    newDisplay.push(newList);
    newDisplay.push(index);
    this.setState({
      list: copy,
      nowDisplay: newDisplay
    })
    this.updateNum();
  }
  
  renderItem(i) {
    return(
      <Item item = {this.state.nowDisplay[0].items[i]} editItem = {() => this.handleItemEdit(i)}
            deleteItem = {() => this.handleItemDelete(i)} changeStatus = {() => this.handleStatusChange(i)}/>
    )

  }
  handleStatusChange(i) {
    let index = this.state.nowDisplay[1];
    let newList = this.state.list[index];
    let copy = this.state.list.slice();
    if(newList.items[i].status){
      newList.items[i].status = false;
    }
    else{
      newList.items[i].status = true;
    }
    let newDisplay = [];
    newDisplay.push(newList);
    newDisplay.push(index);
    copy[index] = newList;
    this.setState({
      list: copy,
      nowDisplay: newDisplay
    })
    this.updateNum();
    
  }
  handleItemEdit(i) {
    let index = this.state.nowDisplay[1];
    var input = prompt("請輸入新的標題", this.state.nowDisplay[0].items[i].title);
    if (input != null) {
      let newList = this.state.list[index];
      let copy = this.state.list.slice();
      newList.items[i].title = input;
      let newDisplay = [];
      newDisplay.push(newList);
      newDisplay.push(index);
      copy[index] = newList;
      this.setState({
        list: copy,
        nowDisplay: newDisplay
      })
      //return Object.assign({}, this.state.list[i], {title: input})
    }
    

  }
  handleItemDelete(i) {
    let index = this.state.nowDisplay[1];
    let copy = this.state.list.slice();
    let newList = this.state.nowDisplay[0];
    newList.items.splice(i,1);
    copy[index] = newList;
    let newDisplay = [];
    newDisplay.push(newList);
    newDisplay.push(index);
    this.setState({
      list: copy,
      nowDisplay: newDisplay
    });
    this.updateNum();
  }
  renderList(i) {
    return(
      <List list = {this.state.list[i]} editList = {() => this.handleListEdit(i)}
            deleteList = {() => this.handleListDelete(i)} showList = {() => this.handleShow(i)}/>
    )
  }
  handleListEdit(i){
    var input = prompt("請輸入新的標題", this.state.list[i].title);
    if (input != null) {
      let newList = this.state.list[i];
      newList.title = input;
      let a = this.state.list.slice();
      a[i] = newList;
      this.setState({list: a})
      //return Object.assign({}, this.state.list[i], {title: input})
    }
  }
  handleListDelete(i) {
    let a = this.state.list.slice();
    let uNum = this.state.unfinishNum;
    let fNum = this.state.finishNum;
    uNum -= this.state.list[i].unfinishNum;
    fNum -= this.state.list[i].finishNum;
    a.splice(i,1);
    this.setState({
                    list:a,
                    nowDisplay: [],
                    unfinishNum: uNum,
                    finishNum: fNum
                  });   
  }
  handleShow(i) {
    let nextDisplay = [];
    nextDisplay.push(this.state.list[i]);
    nextDisplay.push(i);
    this.setState({nowDisplay: nextDisplay});

  }
  newList(){
    let title = document.getElementById('NewList').value;
    let newList = new todoList(title);
    this.setState(prevState =>({
      list: prevState.list.concat(newList)
    }))
  }

}

class todoList {
  constructor(title) {
    this._title = title;
    this._unfinishNum = 0;
    this._finishNum = 0;
    this.items = [];
  }
  get title() {
    return this._title;
  }
  set title(input) {
    this._title = input;
  }
  get unfinishNum() {
    return this._unfinishNum;
  }
  set unfinishNum(input) {
    this._unfinishNum = input;
  }
  get finishNum() {
    return this._finishNum;
  }
  set finishNum(input) {
    this._finishNum = input;
  }
}

class todoItem {
  constructor(title) {
    this._title = title;
    this._status = false;
  }
  get title() {
    return this._title;
  }
  set title(title) {
    this._title = title;
  }
  get status() {
    return this._status;
  }
  set status(input) {
    this._status = input;
  }
}

class List extends React.PureComponent {
  
  render(){
    return(
      <a>
        {this.props.list.title}
        <span className = "finish">{this.props.list.finishNum}</span>
        <span className = "unfinish">{this.props.list.unfinishNum}</span>
        <button className="enter" onClick = {() => this.props.showList()}> <i class="fas fa-sign-in-alt"></i></button>
        <button className="edit" onClick = {() => this.props.editList()}><i className="fas fa-edit"></i></button>
        <button className="close" onClick = {() => this.props.deleteList()}><i className="fas fa-trash"></i></button>
  {/*      <button className="show" onClick={this.props.showList(i)}>進入list{this.props.list[i].title}</button>
        <button className="edit" onClick={this.props.editList(i)}><i className="fas fa-edit"></i></button>
    <button className="close" onClick={this.props.deleteList(i)}><i className="fas fa-trash"></i></button> */}
      </a>
    )
    
    
  }
}

class Item extends Component {
  render(){
    let check = '';
    if(this.props.item.status)
      check = "checked";
    else
      check = '';
    return(<li className={check}>
              {this.props.item.title}
              <button className = "check-item" onClick = {() => this.props.changeStatus()}><i class="fas fa-check"></i></button>
              <button className = "edit-item" onClick = {() => this.props.editItem()}><i class="fas fa-edit"></i></button>
              <button className = "close-item" onClick = {() => this.props.deleteItem()}><i class="fas fa-trash"></i></button>
            
          </li>)
  }

}


export default App;
