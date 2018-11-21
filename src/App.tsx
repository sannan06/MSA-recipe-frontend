import * as React from 'react';
import * as MaterialDesign from '@material-ui/core';
import Recipes from './components/Recipes';
import AddRecipe from './components/AddRecipe';
import MediaStreamRecorder from 'msr';
import './App.css';
import { Snackbar } from '@material-ui/core';

interface IState {
  recipes: any[],
  voiceSearch: any,
  open: boolean,
  vertical: any,
  horizontal: any
}

class App extends React.Component<{}, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      recipes: [],
      voiceSearch: "",
      open: false,
      vertical: 'top',
      horizontal: 'right'
    }
    this.getRecipeSearch = this.getRecipeSearch.bind(this)
    this.searchRecipesByVoice = this.searchRecipesByVoice.bind(this)
    this.postAudio = this.postAudio.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.getRecipes("")
  }

  public render() {
    const { vertical, horizontal } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Recipe Search</h1>
          <AddRecipe />
        </header>
        <form onSubmit = {this.getRecipeSearch} className="search-field">
            <MaterialDesign.TextField type="text" id="recipe-search" style = {{ fontSize:"10px" }} value={this.state.voiceSearch} onChange={this.handleChange}/>
            <div className="btn" onClick={this.handleClick}><i className="fa fa-microphone" /></div>
            <Snackbar
              anchorOrigin={{vertical, horizontal}}
              open={this.state.open}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id" className="message-id">Say a tag to search for it</span>}
            />
            <MaterialDesign.Button onClick={ this.getRecipeSearch }>Search</MaterialDesign.Button>
        </form>
        <Recipes recipes={ this.state.recipes }/>
      </div>
    );
  }

  // Search recipes by tags
  private getRecipeSearch(e: any) {
    e.preventDefault()
    const textBox = document.getElementById("recipe-search") as HTMLInputElement
    if(textBox === null){
      return;
    }
    const recipeSearch = textBox.value
    this.getRecipes(recipeSearch)
  }

  // Fetch recipes based on user search and using API
  private getRecipes = async (recipeSearch: any) => {
    let url = 'https://recipe-bank-api.azurewebsites.net/api/recipe'
    if (recipeSearch !== ""){
      url += "/" + recipeSearch
    } 
    const apiCall = await fetch(url)
    const data = await apiCall.json()

    this.setState({
      recipes: data
    })

  }

  // Get user voice as audio 
  private searchRecipesByVoice = () => {

    const mediaConstraints = {
      audio: true
    }

    const onMediaSuccess = (stream: any) => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
        mediaRecorder.ondataavailable = (blob: any) => {
            mediaRecorder.stop()
            this.postAudio(blob);
        }
        mediaRecorder.start(3000);
    }

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    function onMediaError(e: any) {
        console.error('media error', e);
    }

  }

  // Make API call to inerpret user voice search
  private postAudio = (blob: any) => {

    let accessToken: any;
    fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
        headers: {
            'Content-Length': '0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ocp-Apim-Subscription-Key': '7b49b5562f2e40e786f6e54e7163365a'
        },
        method: 'POST'
    }).then((response) => {
        // console.log(response.text())
        return response.text()
    }).then((response) => {
        console.log(response)
        accessToken = response
    }).catch((error) => {
        console.log("Error", error)
    });

    // POST audio
    fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
      body: blob, // this is a .wav audio file    
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer' + accessToken,
          'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
          'Ocp-Apim-Subscription-Key': '7b49b5562f2e40e786f6e54e7163365a'
      },    
      method: 'POST'
    }).then((res) => {
        return res.json()
    }).then((res: any) => {
      let response = (res.DisplayText as string).slice(0, -1)
      response = response.toLowerCase()
      this.setState({
        voiceSearch: response
      })
        console.log(this.state.voiceSearch)
    }).catch((error) => {
        console.log("Error", error)
    });

  }

  private handleChange = (e:any) => {
    this.setState({
      voiceSearch: e.target.value
    })
  }
  
  // Handle opening of toast
  private handleClick = () => {
    this.setState({ open: true })
    this.searchRecipesByVoice
  }

  // Handle closing of toast
  private handleClose = () => {
    this.setState({ open: false })
  }

}

export default App;
