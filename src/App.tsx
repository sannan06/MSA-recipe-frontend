import * as React from 'react';
import * as MaterialDesign from '@material-ui/core';
import Recipes from './components/Recipes';
import AddRecipe from './components/AddRecipe';
import Authentication from './components/Authentication';
import MediaStreamRecorder from 'msr';
import './App.css';
import { Snackbar } from '@material-ui/core';

interface IState {
  recipes: any[],
  voiceSearch: any,
  open: boolean,
  vertical: any,
  horizontal: any,
  authenticated: boolean,
  refCamera: any,
  errorOpen: boolean,
  currentUser: any,
  openWelcome: any,
  failedAuthenticate: boolean
}

class App extends React.Component<{}, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      recipes: [],
      voiceSearch: "",
      open: false,
      vertical: 'top',
      horizontal: 'right',
      authenticated: false,
      refCamera: React.createRef(),
      errorOpen: false,
      currentUser: null,
      openWelcome: false,
      failedAuthenticate: false,
    }
    this.getRecipeSearch = this.getRecipeSearch.bind(this)
    this.searchRecipesByVoice = this.searchRecipesByVoice.bind(this)
    this.postAudio = this.postAudio.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.allowAccess = this.allowAccess.bind(this)
    this.getRecipes("")
  }

  public render() {
    const { vertical, horizontal } = this.state
    return (
      <div className="App">

      {(!this.state.authenticated) ?
      <Authentication authenticated={this.state.authenticated} refCamera={this.state.refCamera} allowAccess={this.allowAccess}/>
       : ""}

      {(this.state.authenticated) ?
      <div>
        <Snackbar
          anchorOrigin={{vertical, horizontal}}
          open={this.state.openWelcome}
          onClose={this.handleClose}
          autoHideDuration={3000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id" className="message-id">Welcome, {this.state.currentUser}</span>}
        />
        <header className="App-header">
          <h1 className="App-title">Recipe Search</h1>
          <AddRecipe getRecipes={this.getRecipes} currentUser={this.state.currentUser}/>
        </header>
        <form onSubmit = {this.getRecipeSearch} className="search-field">
            <MaterialDesign.TextField type="text" id="recipe-search" style = {{ fontSize:"10px" }} value={this.state.voiceSearch} onChange={this.handleChange}/>
            <div className="btn" onClick={this.searchRecipesByVoice}><i className="fa fa-microphone" /></div>
            <Snackbar
              anchorOrigin={{vertical, horizontal}}
              open={this.state.open}
              onClose={this.handleClose}
              autoHideDuration={6000}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id" className="message-id">Say a tag to search for it</span>}
            />
            <Snackbar
              anchorOrigin={{vertical, horizontal}}
              open={this.state.errorOpen}
              onClose={this.handleClose}
              autoHideDuration={6000}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id" className="message-id">Sorry, please try again</span>}
            />
            <MaterialDesign.Button onClick={ this.getRecipeSearch }>Search</MaterialDesign.Button>
        </form>
        <Recipes recipes={this.state.recipes} currentUser={this.state.currentUser} getRecipes={this.getRecipes}/>
      </div>
          : "" }	 
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
    this.setState({
      open: true
    })

    navigator.mediaDevices.getUserMedia({audio:true})
    .then((stream)=> {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.stop()
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
        mediaRecorder.ondataavailable = (blob: any) => {
            this.postAudio(blob);
            mediaRecorder.stop()
        }
        mediaRecorder.start(3000);
    })
    .catch((e:any)=>{
        console.log(e);
    })

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
      console.log(res.DisplayText)
      let response = (res.DisplayText as string).slice(0, -1)
      response = response.toLowerCase()
      this.setState({
        voiceSearch: response
      })
        console.log(this.state.voiceSearch)
    }).catch((error) => {
      this.setState({
        errorOpen: true,
        open: false
      })
        console.log("Error", error)
    });

  }

  private handleChange = (e:any) => {
    this.setState({
      voiceSearch: e.target.value
    })
  }

  // Handle closing of Snackbar
  private handleClose = () => {
    this.setState({ 
      open: false,
      errorOpen: false,
      openWelcome: false,
     })
  }

  // Authenticate and allow access
  private allowAccess(CR: any) {
    this.setState({
      authenticated: true,
      currentUser: CR,
      openWelcome: true
    })
  }

}

export default App;
