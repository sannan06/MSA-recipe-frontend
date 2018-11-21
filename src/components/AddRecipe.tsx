import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText,  Button, DialogActions } from '../../node_modules/@material-ui/core';
// import Modal from 'react-responsive-modal';

interface IState {
    isOpen: boolean,
    uploadImage: any
}

class AddRecipe extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isOpen: false,
            uploadImage: null
        }
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handleImageUpload = this.handleImageUpload.bind(this)
        this.uploadRecipe = this.uploadRecipe.bind(this)
    }

    public render() {
        return (
            <div>
                <Button className="add-recipe-button" onClick={ this.openModal }>Add Recipe</Button>
                <Dialog
                open={this.state.isOpen}
                onClose={this.closeModal}
                aria-labelledby="form-dialog-title"
                fullWidth
                >
                <DialogTitle id="form-dialog-title"><p className="add-recipe-header">Add Recipe</p></DialogTitle>
                <DialogContent>
                    <DialogContentText className="add-recipe-text"> 
                        Add your recipe to the website! Give it a name, attach a photo of it, give your name, and give the steps needed to make it. 
                    </DialogContentText>
                    <div className="recipe-inputs">
                    <input type = "text" placeholder="Recipe Title" id="recipe-title-input"/>
                    <input type = "text" placeholder="Your Name" id="recipe-publisher-input"/>
                    <input type = "text" placeholder="Tag" id="recipe-tag-input"/>
                    <textarea placeholder="Enter steps here..." id="recipe-steps"></textarea>
                    </div>
                    <input type="file" onChange={ this.handleImageUpload } id="recipe-image-input"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.uploadRecipe} color="primary">
                        Upload
                    </Button>
                </DialogActions>  
                </Dialog>
            </div>
        )
    }

    // Modal open
    private openModal = () => {
        this.setState({ isOpen: true })
    }

    // Modal close
    private closeModal = () => {
        this.setState({ isOpen: false })
    }

    // Receive input for recipe image
    private handleImageUpload(imageList: any) {
        this.setState({
            uploadImage: imageList.target.files
        })
        console.log(this.state.uploadImage)
    }

    // Make POST Request
    private uploadRecipe() {
        const recipeTitle = document.getElementById("recipe-title-input") as HTMLInputElement
        const publisherInput = document.getElementById("recipe-publisher-input") as HTMLInputElement
        const tagInput = document.getElementById("recipe-tag-input") as HTMLInputElement
        const recipeSteps = document.getElementById("recipe-steps") as HTMLInputElement
        const imageInput = this.state.uploadImage[0]

        if(recipeTitle === null || publisherInput === null || tagInput === null) {
            return
        }

        const title = recipeTitle.value
        const tag = tagInput.value
        const publisher = publisherInput.value
        const steps = recipeSteps.value
        const url = "https://recipe-bank-api.azurewebsites.net/api/recipe/upload"

        const formData = new FormData()
        formData.append("title", title)
        formData.append("tag", tag)
        formData.append("publisher", publisher)
        formData.append("steps", steps)
        formData.append("image_url", imageInput)

        fetch(url, {
            body: formData,
            headers: {'cache-control': 'no-cache'},
            method: 'POST'
        })
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})

    }
}

export default AddRecipe