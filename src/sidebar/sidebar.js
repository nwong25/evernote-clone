import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import List from '@material-ui/core/List';
import { Divider, Button } from '@material-ui/core';
import SideBarItem from '../sideBarItem/sideBarItem';

class SideBar extends React.Component {
  constructor() {
    super();

    this.state = {
      addingNote: false,
      title: null
    };
  }

  newNoteBtnClick = () => {
    const { addingNote } = this.state;

    this.setState({
      title: null,
      addingNote: !addingNote
    });
  };

  updateTitle = txt => {
    this.setState({
      title: txt
    });
  };

  newNote = () => {
    const { title } = this.state;
    this.props.newNote(title);
    this.setState({
      title: null,
      addingNote: null
    });
  };

  deleteNote = note => {
    if (window.confirm(`Are you sure you want to delete: ${note.title}`)) {
      this.props.deleteNote(note);
    }
  };

  render() {
    const { classes, notes, selectedNoteIndex, selectNote } = this.props;
    const { addingNote } = this.state;

    return (
      <div className={classes.sidebarContainer}>
        <Button onClick={this.newNoteBtnClick} className={classes.newNoteBtn}>
          {addingNote ? 'Cancel' : 'New Note'}
        </Button>
        {addingNote ? (
          <div>
            <input
              type="text"
              className={classes.newNoteInput}
              placeholder="Enter note title"
              onKeyUp={e => this.updateTitle(e.target.value)}
            ></input>

            <Button className={classes.newNoteSubmitBtn} onClick={this.newNote}>
              Submit Note
            </Button>
          </div>
        ) : null}
        <List>
          {notes &&
            notes.map((_note, _index) => {
              return (
                <div key={_index}>
                  <SideBarItem
                    _note={_note}
                    _index={_index}
                    selectedNoteIndex={selectedNoteIndex}
                    selectNote={selectNote}
                    deleteNote={this.deleteNote}
                  />
                  <Divider></Divider>
                </div>
              );
            })}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(SideBar);
