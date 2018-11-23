import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { DialogActions, DialogContent, DialogContentText, Snackbar } from '../../node_modules/@material-ui/core';
import { TwitterShareButton, TumblrShareButton, PinterestShareButton, RedditShareButton } from "react-simple-share";

interface IProps{
    recipes: any[],
    currentUser: any,
    getRecipes: any,
}

interface IState{
    open: any,  // Open dialog to view recipes
    editOpen: any, // Open dialog to edit recipes
    openEdited: boolean, // Open Snackbar to say recipe is edited
    openDeleted: boolean, // Open Snackbar to say recipe is deleted
    vertical: any,
    horizontal: any,
}

export default class Recipes extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            open: null,
            editOpen: null,
            openEdited: false,
            vertical: 'bottom',
            horizontal: 'right',
            openDeleted: false
        }
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.openEditRecipe = this.openEditRecipe.bind(this)
        this.updateRecipe = this.updateRecipe.bind(this)
        this.deleteRecipe = this.deleteRecipe.bind(this)   
    }

    public render() {
        const { vertical, horizontal } = this.state
    
        return(
         <div className="container">
                 <div className="row">
                   { this.props.recipes.map((recipe, index) =>{
                     return (
                         <div key = { recipe.id } className="col-md-4" style={{ marginBottom: "2rem", marginTop: "2rem" }}>
                             <div className="recipes__box">
                                 <img className="recipes__box-img" src={ recipe.image_url } alt={ recipe.title }/>
                                 <div className="recipe__text"> 
                                     <h5 className="recipes__title"> 
                                     { recipe.title.length < 20 ? `${recipe.title}` : `${recipe.title.substring(0, 25)}...` } 
                                     </h5>
                                     <p className="recipes__subtitle">Publisher: <span>
                                     { recipe.publisher }
                                     </span></p>
                                 </div>
                                 <Button onClick = {e => this.handleClickOpen(e, index)}>View</Button>
                                 <Dialog 
                                    open = {this.state.open === index}
                                    onClose = {this.handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                <p className="recipe-header">{recipe.title}</p>
                                <DialogContent className="dialog-box-text">
                                    <img src={ recipe.image_url } alt={ recipe.title }/>
                                    <DialogContentText>
                                        Published By: { recipe.publisher }
                                    </DialogContentText>
                                    <h2 className="steps-title">Steps:</h2>
                                    <p>{ recipe.steps }</p>
                                    <h3>Share this recipe:</h3>
                                    <div className="share-buttons">
                                    <TwitterShareButton
                                        url={window.location.href}
                                        size="40px"
                                        text={`Check out this recipe for ${recipe.title} from Recipe Search!\n${recipe.steps}\n`}
                                        hashtags={`food,recipes,${recipe.tag}`}
                                    />
                                    <TumblrShareButton
                                        url={window.location.href}
                                        size="40px"
                                        title={`Recipe for ${recipe.title}`}
                                        caption={`Steps:\n${recipe.steps}`}
                                        tags={`food,recipes,${recipe.tag}`}
                                    />
                                    <PinterestShareButton
                                        url={window.location.href}
                                        size="40px"
                                        description={`Check out this recipe for ${recipe.title} at Recipe Share!`}
                                        media={recipe.image_url}
                                    />
                                    <RedditShareButton
                                        url={window.location.href}
                                        size="40px"
                                        title={`Check out ${recipe.title} at Recipe Search!`}
                                    />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>      
                                </Dialog>

                                 <Button onClick = {e => this.openEditRecipe(e, index)}>Edit</Button>
                                 <Dialog
                                    open={this.state.editOpen === index}
                                    onClose = {this.closeEditRecipe}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                 >
                                <p className="recipe-header">Edit Recipe</p>
                                <DialogContent className="dialog-box-text">
                                <DialogContentText className="add-recipe-text">Edit this recipe if you see any errors, or have a better way to make it!</DialogContentText>
                                <div className="recipe-inputs">
                                <input type = "text" id="recipe-title-edit" defaultValue={recipe.title}/>    
                                <textarea placeholder="Enter steps here..." id="recipe-steps-edit" defaultValue={recipe.steps}></textarea>
                                <DialogContentText className="add-recipe-text">Change the tag if needed: </DialogContentText>
                                <input type = "text" id="recipe-tag-edit" defaultValue={recipe.tag}/>
                                </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={e=>{this.updateRecipe(recipe)}} color="primary">
                                        Update
                                    </Button>
                                </DialogActions>   
                                 </Dialog>
                                 {!(recipe.publisher.localeCompare(this.props.currentUser)) ?
                                 <Button onClick={e=>{this.deleteRecipe(recipe)}}>Delete</Button>
                                 : ""}
                                 <Snackbar
                                    anchorOrigin={{vertical, horizontal}}
                                    open={this.state.openEdited}
                                    onClose={this.handleClose}
                                    autoHideDuration={6000}
                                    ContentProps={{
                                        'aria-describedby': 'message-id',
                                    }}
                                    message={<span id="message-id" className="message-id">Edited recipe</span>}
                                />
                                <Snackbar
                                    anchorOrigin={{vertical, horizontal}}
                                    open={this.state.openDeleted}
                                    onClose={this.handleClose}
                                    autoHideDuration={6000}
                                    ContentProps={{
                                        'aria-describedby': 'message-id',
                                    }}
                                    message={<span id="message-id" className="message-id">Deleted recipe</span>}
                                />
                             </div>
                         </div>
                     )
                     }) }
                 </div>
             </div>
        )
    }
    
    // Dialog to view recipe open
    private handleClickOpen(e:any, index: any){
        this.setState({ open: index }) 
    }

    // Dialog to close recipe 
    private handleClose = () => {
        this.setState({ 
            open: null,
            openEdited: false,
            openDeleted: false 
        })
    }

    // Dialog to edit recipe open
    private openEditRecipe(e:any, index:any){
        this.setState({
            editOpen: index
        })
    }

    // Close edit recipe dialog
    private closeEditRecipe = () => {
        this.setState({
            editOpen: null
        })
    }

    // Make PUT request
    private updateRecipe(recipe: any) {
        const titleInput = document.getElementById("recipe-title-edit") as HTMLInputElement
        const tagInput = document.getElementById("recipe-tag-edit") as HTMLInputElement
        const stepsInput = document.getElementById("recipe-steps-edit") as HTMLInputElement

        if (titleInput === null || tagInput === null || stepsInput === null) {
            return
        }

        const url = "https://recipe-bank-api.azurewebsites.net/api/recipe/" + recipe.id
        const title = titleInput.value
        const tag = tagInput.value
        const steps = stepsInput.value

        fetch(url, {
            body: JSON.stringify({
                "id" : recipe.id, 
                "publisher" : recipe.publisher,
                "title" : title,
                "image_url" : recipe.image_url,
                "steps" : steps,
                "tag" : tag
            }),
            headers: {'cache-control':'no-cache', 'Content-type':'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
                this.closeEditRecipe()
                this.setState({
                    openEdited: true
                })
				this.props.getRecipes("")
			}
		})

    }

    // Make DELETE request
    private deleteRecipe(recipe: any) {
        const url = 'https://recipe-bank-api.azurewebsites.net/api/recipe'
        console.log(recipe.id)
        fetch(url + '/' + recipe.id, {
            method: 'DELETE'
        })
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
                this.setState({
                    openDeleted: true
                })
				this.props.getRecipes("")
			}
		})
    }


}
