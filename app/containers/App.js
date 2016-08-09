import React, {
  Component,
  PropTypes
} from 'react';
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
const {
  dialog
} = require('electron').remote;
const {
  ipcRenderer
} = require('electron');

import * as Actions from '../actions'

import DictionaryIndexPage from '../components/DictionaryIndexPage';
import DictionaryPage from '../components/DictionaryPage';

import Menu from '../components/Menu';
import WordDefination from '../components/WordDefination';

require('../../dist/index.css');


class App extends Component {
  componentWillMount() {
    const receiveFiles = this.props.actions.receiveFiles;
    const receiveKeys = this.props.actions.receiveKeys;

    const { receiveWord } = this.props.actions;

    ipcRenderer.on('receiveKeys', (event, data) => {
      console.log('ipc receiveKeys')
      console.log(data);
      receiveKeys(data);
    });

    ipcRenderer.on('receiveFiles', (event, data) => {
      console.log('ipc receiveFiles')
      receiveFiles(data);
    });

    ipcRenderer.on('readWord', (event, data) => {
      console.log('ipc readWord');
      receiveWord(data);
    })
  }

  componentDidUpdate() {
  }

  openFile() {
    const ping = this.props.actions.ping;
    ping();
  }

  renderPages() {
    let files = this.props.files;
    let dictionary = this.props.dictionary;
    const actions = this.props.actions;
    const currentRoute = this.props.route.currentRoute;
    let pages = {}
    pages['main'] = () => <DictionaryIndexPage dictionary={dictionary} actions={actions} />
    pages['dictionaryShow'] = () => <DictionaryPage dictionary={dictionary} actions={actions} />

    if (pages[currentRoute]) {
      return pages[currentRoute]()
    } else {
      return pages['main']();
    }
  }

  render() {
    
    return (
      <div className="MainContent">
        <Menu
          {...this.props}
        />
        <div className="container menu-offset">
          <WordDefination
            word={this.props.word}
            addWord={this.props.actions.addWord}
          />
        </div>
      </div>
    );
  }

}

App.propTypes = {
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
