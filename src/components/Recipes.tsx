import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { DialogTitle, DialogActions, DialogContent, DialogContentText } from '../../node_modules/@material-ui/core';

interface IProps{
    recipes: any[],
}

interface IState{
    open: any;
}

export default class Recipes extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            open: null
        }
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)   
    }

    public render() {
    
        return(
         <div className="container">
                 <div className="row">
                   { this.props.recipes.map((recipe, index) =>{
                     return (
                         <div key = { recipe.recipe_id } className="col-md-4" style={{ marginBottom: "2rem", marginTop: "2rem" }}>
                             <div className="recipes__box">
                                 <img className="recipes__box-img" src={ recipe.image_url } alt={ recipe.title }/>
                                 <div className="recipe__text"> 
                                     <h5 className="recipes__title"> 
                                     { recipe.title.length < 20 ? `${recipe.title}` : `${recipe.title.substring(0, 25)}...` } 
                                     </h5>
                                     <p className="recipes__subtitle">Publisher: <span>
                                     { recipe.publisher < 20 ? `${recipe.publisher}` : `${recipe.publisher.substring(0, 25)}...`  }
                                     </span></p>
                                 </div>
                                 <Button onClick = {e => this.handleClickOpen(e, index)}>View Recipe</Button>
                                 <Dialog 
                                    open = {this.state.open === index}
                                    onClose = {this.handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                <DialogTitle id="alert-dialog-title">
                                <h1 className="dialog-box-title">{recipe.title}</h1>
                                </DialogTitle>
                                <DialogContent className="dialog-box-text">
                                    <img src={ recipe.image_url } alt={ recipe.title }/>
                                    <DialogContentText>
                                        <p>Published By: { recipe.publisher }</p>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>      
                                </Dialog>
                                 <Button>Edit Recipe</Button>
                                 <Button>Delete</Button>
                             </div>
                         </div>
                     )
                     }) }
                 </div>
             </div>
        )
    }
    
    // Modal open
    private handleClickOpen(e:any, index: any){
        this.setState({ open: index }) 
    }

    // Modal close
    private handleClose = () => {
        this.setState({ open: null })
    }
}
