import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { DialogTitle, DialogActions } from '../../node_modules/@material-ui/core';

interface IProps{
    recipes: any[],
}

interface IState{
    open: boolean
}

export default class Recipes extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            open: false
        }
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)   
    }

    public render() {
    
        return(
         <div className="container">
                 <div className="row">
                   { this.props.recipes.map((recipe) =>{
                     return (
                         <div key = { recipe.recipe_id } className="col-md-4" style={{ marginBottom: "2rem" }}>
                             <div className="recipes__box">
                                 <img className="recipes__box-img" src={ recipe.image_url } alt={ recipe.title }/>
                                 <div className="recipe__text"> 
                                     <h5 className="recipes__title"> 
                                     { recipe.title.length < 20 ? `${recipe.title}` : `${recipe.title.substring(0, 25)}...` } 
                                     </h5>
                                     <p className="recipes__subtitle">Publisher: <span>
                                     { recipe.publisher < 15 ? `${recipe.publisher}` : `${recipe.publisher.substring(0, 15)}...`  }
                                     </span></p>
                                 </div>
                                 <Button onClick = {this.handleClickOpen}>View Recipe</Button>
                                 <Dialog 
                                     open = {this.state.open}
                                     onClose = {this.handleClose}
                                     aria-labelledby="alert-dialog-title"
                                     aria-describedby="alert-dialog-description"
                                 >
                                  <DialogTitle id="alert-dialog-title">{recipe.title}</DialogTitle>
                                  <DialogActions>
                                     <Button onClick={this.handleClose} color="primary">
                                         Close
                                     </Button>
                                  </DialogActions>      
                                 </Dialog>

                                 <Button>Edit Recipe</Button>
                             </div>
                         </div>
                     )
                     }) }
                 </div>
             </div>
        )
    }
    
    private handleClickOpen = () => {
        this.setState({ open: true }) 
    }

    private handleClose = () => {
        this.setState({ open: false })
    }
}
