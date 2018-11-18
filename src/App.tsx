import * as React from 'react';
import * as MaterialDesign from '@material-ui/core';
import './App.css';

interface IState {
  recipes: any[],
}

class App extends React.Component<{}, IState> {
  constructor(props: any){
    super(props)
    this.state = {
      recipes: []
    }
    this.getRecipeSearch = this.getRecipeSearch.bind(this)
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Recipe Search</h1>
        </header>
        <form onSubmit = {this.getRecipeSearch}>
            <MaterialDesign.TextField type="text" id="recipe-search"/>
            <MaterialDesign.Button onClick={ this.getRecipeSearch }>Search</MaterialDesign.Button>
        </form>
        { this.state.recipes.map((recipe) =>{
          return (
            <div key={ recipe.recipe_id }>
              <img src={ recipe.image_url } alt={ recipe.title }/>
              <p>{ recipe.title }</p>
            </div>
          )
        }) }
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
    console.log(url)
    const apiCall = await fetch(url)
    const data = await apiCall.json()
    this.setState({
      recipes: data.recipes
    })
    console.log(this.state.recipes)
  }

}

export default App;
