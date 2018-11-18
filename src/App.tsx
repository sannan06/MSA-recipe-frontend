import * as React from 'react';
import './App.css';

interface IState {
  recipeSearch: any,
  recipes: any[],
  currentRecipe: any
}

class App extends React.Component<{}, IState> {
  constructor(props: any){
    super(props)
    this.getRecipeSearch = this.getRecipeSearch.bind(this)
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Recipe Search</h1>
        </header>
        <form onSubmit = {this.getRecipeSearch}>
            <input type="text" id="recipe-search"/>
            <button>Search</button>
        </form>
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
    let url = 'https://www.food2fork.com/api/search?key=2ba83b7abd60e90277b69ee6bcfe8a5d'
    if (recipeSearch !== ""){
      url += "&q=" + recipeSearch + "&count=12"
    } else{
      url += "&count=12"
    }
    const apiCall = await fetch(url)
    const data = await apiCall.json()
    this.setState({
      recipes: data.recipes
    })
    console.log(this.state.recipes)
  }

}

export default App;
