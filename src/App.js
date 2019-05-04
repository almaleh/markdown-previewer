import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.css';

// Markdown Renderer

const marked = window.marked; 

marked.setOptions({
  breaks: true
});
const renderer = new marked.Renderer(); 
renderer.link = function(href, title, text) {
  return '<a target="_blank" href="${href}">${text}' + '</a>';
}


// Redux
const EDIT = 'EDIT';
const defaultMarkdown = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
`

const markdownReducer = (state = defaultMarkdown, action) => {
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
    editMarkdown: (newMarkdown) => {
      dispatch(editMarkdown(newMarkdown));
    }
  }
}


// React

class Previewer extends React.Component {
  constructor(props){
    super(props); 
    this.processMarkdown = this.processMarkdown.bind(this); 
  }

  processMarkdown() {
    return marked(this.props.markdown, { renderer: renderer})
  }

  render(){
    return(
      <>
      <h3>Previewer</h3>
      <section id="preview" dangerouslySetInnerHTML={{__html: this.processMarkdown()}} />
      </>
    )
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this); 
  }

  handleTextChange(event) {
    this.props.editMarkdown(event.target.value)
  }

  render() {
    return (
      <>
      <h2>Editor</h2>
      <textarea id="editor" defaultValue={this.props.markdown} onChange={this.handleTextChange}></textarea>
      </>
    )
  }
}

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let markdown = this.props.markdown; 
    let editMarkdown = this.props.editMarkdown; 
    return (
      <header className="App-header">
        <Editor markdown={markdown} editMarkdown={editMarkdown}/>
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
