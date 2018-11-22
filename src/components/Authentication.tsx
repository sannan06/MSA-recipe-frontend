import * as React from 'react';
import Modal from 'react-responsive-modal';
import * as Webcam from "react-webcam";
import * as MaterialDesign from '@material-ui/core';


interface IProps {
    authenticated: boolean,
    refCamera: any,
    allowAccess: any
}

interface IState {
    predictionResult: any,
}

export default class Recipes extends React.Component<IProps, IState> {
    constructor (props: any){
        super(props)
        this.state = {
            predictionResult: null
        }
        this.authenticate = this.authenticate.bind(this)
    }

    public render() {
        return (
        <Modal open={!this.props.authenticated} onClose={this.authenticate} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
        <h1>Facial Verification Required</h1>
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          ref={this.props.refCamera}
        />
        <div className="row nav-row">
          <MaterialDesign.Button onClick={this.authenticate} className="login-button">Login</MaterialDesign.Button>
        </div>
      </Modal>
        )
    }

      // Authenticate
  private authenticate() {
    const screenshot = this.props.refCamera.current.getScreenshot();
	  this.getFaceRecognitionResult(screenshot);
  }

  // Call custom vision model
  private getFaceRecognitionResult(image: string) {
    const url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3cdd03ca-fa60-4655-b041-22a7208f049a/image?iterationId=043ef7eb-aa19-4c24-b828-b583a774a4ce"
    if (image === null) {
      return;
    }
    const base64 = require('base64-js');
    const base64content = image.split(";")[1].split(",")[1]
    const byteArray = base64.toByteArray(base64content);
    fetch(url, {
      body: byteArray,
      headers: {
        'cache-control': 'no-cache', 'Prediction-Key': '8b81665bb28e46e888d6c4e9bedc441f', 'Content-Type': 'application/octet-stream'
      },
      method: 'POST'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText)
        } else {
          response.json().then((json: any) => {
            console.log(json.predictions[0])
            this.setState({predictionResult: json.predictions[0] })
            if (this.state.predictionResult.probability > 0.7) {
                this.props.allowAccess(this.state.predictionResult.tagName)
            //   this.setState({
            //     authenticated: true,
            //     currentUser: this.state.predictionResult.tagName,
            //     openWelcome: true,
            //   })
            } else {
              alert("Could not authenticate user. Try again")
            }
          })
        }
      })
  }
    
}