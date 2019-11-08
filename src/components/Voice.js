import React, {Component} from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const recognition = SpeechRecognition ? new SpeechRecognition() : false;

if (recognition) {
  recognition.continous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'
}

class Voice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listening: false,
      recognition: recognition
    }
    this._handleListen = this._handleListen.bind(this)
  }

  _handleListen(){
    if (this.state.recognition) {
      let finalTranscript = ''
      let interimTranscript = ''

      recognition.start();

      recognition.onresult = event => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript + ' ';
          else interimTranscript += transcript;
        }
        if (finalTranscript) {
          this.props.newCommand(finalTranscript)
          setTimeout(() => this._handleListen(), 100)
        }
        recognition.stop();
      }
    }
  }

  componentDidMount() {
    this._handleListen()
  }

  render() {
    return <span></span>;
  }
}

export default Voice