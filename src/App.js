import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.css';
// import { prependListener } from 'cluster';

// Markdown Renderer

const marked = window.marked; 

marked.setOptions({
  breaks: true
});
const renderer = new marked.Renderer(); 
renderer.link = function(href, title, text) {
  return `<a target="_blank" href="${href}">${text}` + '</a>';
}


// Redux
const EDIT = 'EDIT';
const defaultMarkdown = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...

[Link to Google](https://www.google.com/)
[This is another link](https://yahoo.com/)
&nbsp;

\`var someString: String = "This is a Swift string"\`

\`\`\`swift
func printer(name: String) {
  print(name)
}
\`\`\`
&nbsp;
- One
- Two
- Three
- As many as you want

Here's an **image**: 
&nbsp;
<p align="center">![macbook](http://oi64.tinypic.com/eumvsh.jpg)</p>
&nbsp;
- Some guy:
> We don't know what we're doing

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
      <fragment>
      <h3>Previewer</h3>
      <section id="preview" dangerouslySetInnerHTML={{__html: this.processMarkdown()}} />
      </fragment>
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
      <fragment>
      <h2>Editor</h2>
      <textarea id="editor" defaultValue={this.props.markdown} onChange={this.handleTextChange}></textarea>
      </fragment>
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
