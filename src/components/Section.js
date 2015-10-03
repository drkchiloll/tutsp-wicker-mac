import React from 'react';
import {markdown} from 'markdown';

export default class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getState(props);
  }
  getState = props => ({
    content : props.section.content,
    html : props.section.content ? markdown.toHTML(props.section.content) : ''
  })
  render() {
    let content = (
      <span dangerouslySetInnerHTML={ { __html : this.state.html } }/>
    );
    let classes = ['row', 'section'];
    return (
      <section className={classes.join('')}>
        {content}
      </section>
    )
  }
}
