import React from 'react';
import './App.css';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers } from 'redux'

// Redux
const EDIT = 'EDIT';

const markdownReducer = (state = 'No markdown', action) => {
  switch (action.type) {
    case EDIT:
      return action.newMarkdown;
    default:
      return state;
  }
}

const editMarkdown = (newMarkdown) => {
  return {
    type: EDIT,
    newMarkdown
  }
}

const markdownStore = createStore(markdownReducer);

// React-Redux

const mapStateToProps = (state) => {
  return { markdown: state }
};

const mapDispatchToProps = (dispatch) => {
  return {
    editMarkdown: () => {
      dispatch(editMarkdown);
    }
  }
}


// React

class Previewer extends React.Component {
  constructor(props){
    super(props); 
  }
  render(){
    return(
      <p>This is the Previewer. Markdown rendered: {this.props.markdown}</p>
    )
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: props.markdown
    }
  }

  render() {
    return (
      <p>This is the editor. Markdown status: {this.state.markdown}</p>
    )
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let markdown = this.props.markdown; 
    return (
      <header className="App-header">
        A test, for the ages. 
        <Editor markdown={markdown}/>
        <br/>
        <Previewer markdown={markdown}/>
      </header> 
    )
  }
}

function App() {
  return (
      <Provider store={markdownStore}>
        <Container />
      </Provider>
  );
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Wrapper);

export default App;
