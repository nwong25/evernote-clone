import React from 'react';
import SideBar from './sidebar/sidebar';
import Editor from './editor/editor';

import './App.css';
const firebase = require('firebase');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('notes')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map(doc => {
          const data = doc.data();
          data['id'] = doc.id;
          return data;
        });
        this.setState({
          notes
        });
      });
  }

  selectNote = (note, index) => {
    this.setState({
      selectedNoteIndex: index,
      selectedNote: note
    });
  };

  noteUpdate = (id, note) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  };

  newNote = async title => {
    const { notes } = this.state;

    const note = {
      title,
      body: ''
    };

    const newFromDB = await firebase
      .firestore()
      .collection('notes')
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    const newID = newFromDB.id;

    await this.setState({
      notes: [...notes, note]
    });

    const newNoteIndex = notes.reduce((basket, currentVal, index) => {
      if (currentVal.id === newID) {
        basket = index;
      }
      return basket;
    });

    this.setState({
      selectedNote: notes[newNoteIndex],
      selectedNoteIndex: newNoteIndex
    });
  };

  deleteNote = async note => {
    const { notes, selectedNoteIndex } = this.state;

    const noteIndex = notes.indexOf(note);

    await this.setState({
      notes: notes.filter(_note => _note !== note)
    });

    if (selectedNoteIndex === noteIndex) {
      this.setState({
        selectedNoteIndex: null,
        selectedNote: null
      });
    } else {
      notes.length > 1
        ? this.selectNote(notes[selectedNoteIndex - 1], selectedNoteIndex - 1)
        : this.setState({
            selectedNoteIndex: null,
            selectedNote: null
          });
    }

    firebase
      .firestore()
      .collection('notes')
      .doc(note.id)
      .delete();
  };

  render() {
    const { notes, selectedNoteIndex, selectedNote } = this.state;
    return (
      <div className="app-container">
        <SideBar
          selectedNoteIndex={selectedNoteIndex}
          notes={notes}
          selectNote={this.selectNote}
          newNote={this.newNote}
          deleteNote={this.deleteNote}
        />

        {selectedNote && (
          <Editor
            selectedNote={selectedNote}
            selectedNoteIndex={selectedNoteIndex}
            notes={notes}
            noteUpdate={this.noteUpdate}
          />
        )}
      </div>
    );
  }
}

export default App;
