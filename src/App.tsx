import * as React from 'react';
import * as MaterialDesign from '@material-ui/core';
import Recipes from './components/Recipes';
import AddRecipe from './components/AddRecipe';
import MediaStreamRecorder from 'msr';
import './App.css';

interface IState {
  recipes: any[],
  open: boolean
}

class App extends React.Component<{}, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      recipes: [],
      open: false
    }
    this.getRecipeSearch = this.getRecipeSearch.bind(this)
    this.searchRecipesByVoice = this.searchRecipesByVoice.bind(this)
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Recipe Search</h1>
          <AddRecipe />
        </header>
        <form onSubmit = {this.getRecipeSearch} className="search-field">
            <MaterialDesign.TextField type="text" id="recipe-search" style = {{ fontSize:"10px" }}/>
            <div className="btn" ><i className="fa fa-microphone" /></div>
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
    let url = 'https://www.food2fork.com/api/search?key=0a96d0a56859b5e2c759d18bcccc097d'
    if (recipeSearch !== ""){
      url += "&q=" + recipeSearch + "&count=12"
    } else{
      url += "&count=12"
    }
    const apiCall = await fetch(url)
    const data = await apiCall.json()

    // If API returns valid response (i.e. 12 recipes are returned)
    if(data.count === 12){
      this.setState({
        recipes: data.recipes
      })
    } else{
      alert("Bad Request")
    }

  }

  private searchRecipesByVoice () {

    const mediaConstraints = {
    audio: true
    }

    const onMediaSuccess = (stream: any) => {
        const mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
        mediaRecorder.ondataavailable = (blob: any) => {
            // this.postAudio(blob);
            mediaRecorder.stop()
        }
        mediaRecorder.start(3000);
    }

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    function onMediaError(e: any) {
        console.error('media error', e);
    }
  }

}

export default App;
