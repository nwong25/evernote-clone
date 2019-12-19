import React from 'react';
import ReactQuill from 'react-quill';
import debounce from '../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class EditorComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      text: '',
      title: '',
      id: ''
    };
  }

  componentDidMount() {
    const { selectedNote } = this.props;
    this.setState({
      text: selectedNote.body,
      title: selectedNote.title,
      id: selectedNote.id
    });
  }

  componentDidUpdate() {
    const { selectedNote } = this.props;
    const { id } = this.state;

    if (selectedNote.id !== id) {
      this.setState({
        text: selectedNote.body,
        title: selectedNote.title,
        id: selectedNote.id
      });
    }
  }

  updateBody = async val => {
    await this.setState({
      text: val
    });
    this.update();
  };

  updateTitle = async val => {
    await this.setState({
      title: val
    });
    this.update();
  };

  update = debounce(() => {
    const { noteUpdate } = this.props;
    const { id, title, text } = this.state;
    noteUpdate(id, {
      title,
      body: text
    });
  }, 1500);

  render() {
    const { classes } = this.props;
    const { text, title } = this.state;
    return (
      <div className={classes.editorContainer}>
        <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
        <input
          className={classes.titleInput}
          placeholder="Note title..."
          value={title ? title : ''}
          onChange={e => this.updateTitle(e.target.value)}
        ></input>
        <ReactQuill value={text} onChange={this.updateBody}></ReactQuill>
      </div>
    );
  }
}

export default withStyles(styles)(EditorComponent);
