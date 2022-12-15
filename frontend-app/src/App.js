import React, {useState} from 'react';
import './App.css';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Logo from "./header/Logo";
import $ from 'jquery';


/** +++++++++++++++++++++++++++++++ THE MAIN FUNCTION ++++++++++++++++++++++++++++++++++++++++++++++++++ */
const App = () => {

    /** declare state needed by the app */
    const [result, setResult] = useState([]);
    const [text1, setText1] = useState([]);
    const [text2, setText2] = useState([]);
    const [showResults, setShowResults] = useState(false)
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState(false);
    const [afterCompare, setAfterCompare] = useState(false);

    /** the constant used to check if the selected file is a text file */
    const textFile = /text.*/;

    /** declare first method that has to be executed when first file is selected */
    const readFirstFile = () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            const file = document.getElementById('firstFile').files[0];
            const reader = new FileReader();

            if (file.type.match(textFile)) {
                reader.onload = function (event) {
                    // textPreview.innerHTML = event.target.result;
                    setText1(stringToArray(event.target.result));

                }
            } else {
                setError(true);
            }
            reader.readAsText(file);

        } else {
            alert("Your browser is too old to support HTML5 File API");
        }
    }

    /** declare second method that has to be executed when first file is selected */
    const readSecondFile = () => {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var file = document.getElementById('secondFile').files[0];
            var reader = new FileReader();

            if (file.type.match(textFile)) {
                reader.onload = function (event) {
                    // textPreview2.innerHTML = event.target.result;
                    setText2(stringToArray(event.target.result));
                }
            } else {
                setError(true);
            }
            reader.readAsText(file);

        } else {
            alert("Your browser is too old to support HTML5 File API");
        }
    }

    /** function to convert string to array, element for every new line */
    const stringToArray = (text) => {
        return Array.from(text.replace(/[\r\n]+/g, "#")?.split('#'));
    }

    /** A method that will be invoked when user clicks compare button after reading contents of the two files */
    const compareOnClick = () => {
        let results = [];

        // set results to all array elements found in both text1 and text2
        //results = text1.filter(s => text2.includes(s));
        results=text1.filter(s=>{
                let value=s.split(',')[0]?.split(':')[1];
                let description=s.split(',')[1]?.split(':')[1];
            let extra=s.split(',')[2]?.split(':')[1];

                let results2=text2.filter(s2=> {
                    let value2 = s2.split(',')[0]?.split(':')[1];
                    let description2 = s2.split(',')[1]?.split(':')[1];
                    let extra2=s.split(',')[2]?.split(':')[1];

                    return ((value===value2 || description===description2) && extra2==extra)

                })
            return results2.length>0;

        })
        setResult(results);
        setAfterCompare(true);
        setShowResults(true);
        setOpen(true);
    }

    /** A method that will be invoked when user wants to reset everything */
    const clearOnClick = () => {
        setResult([]);
        setText1([]);
        setText2([]);
        setAfterCompare(false);
        setShowResults(false);
        setOpen(false);
        $('input[type="file"]')?.val('');
    }

    /** A function that closes comparison success dialog as well as send success dialog */
    const handleSuccessClose = () => {
        setOpen(false);
        setSendSuccess(false)
    }

    /** A function that closes comparison error dialog as well as send error dialog */
    const handleErrorClose = () => {
        setError(false);
        setSendError(false)
    }

    /** A function that sends the results to a message broker, RabbitMQ */
    const sendToAnotherApp = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: result})
        };
        const res = await fetch('http://localhost:8080/api/send', requestOptions)
        if (Array.from([200, 201])?.includes(res?.status)) {
            setSendSuccess(true);
            setTimeout(() => {
                setSendSuccess(false)
            }, 5000)
            setShowResults(false);
        } else {
            console.log(res)
            setSendError(true)
            setTimeout(() => {
                setSendError(false)
            }, 5000)
        }
    }

    /** The main function return section which defines the main interface markup*/
    return (
        <div className='bg-bg-dark bg-opacity-10 rounded-3 container'>

            { /* The dialog that is going to dispaly an error message should an error occur while send message to broker */}
            <Dialog open={sendError} onClose={handleErrorClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" className={'bg-danger text-white bold'}>
                    {'Operation Feedback'}
                </DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description" className={'text-danger'}>
                        <br/>
                        <span className="text-danger">There was an error send message to broker.</span>
                        <br/>
                        <span
                            className="small bold">If the error persists, get assistance from system administrator.</span>
                        <br/>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <div className="d-flex">
                        <Button onClick={handleErrorClose}> Close </Button>
                        <Button onClick={handleErrorClose} autoFocus> OK </Button>
                    </div>
                </DialogActions>
            </Dialog>

            { /* The dialog thatbis going to dispaly a success message after successful comparison */}
            <Dialog open={sendSuccess} onClose={handleSuccessClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" className={'bg-success text-white bold'}>
                    {'Operation Feedback'}
                </DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description" className={'text-success'}>
                        <br/>
                        <span className="text-success">Message has been sent to the broker successfully.</span>
                        <br/>
                        <span className="small bold">Go on and check for the message in the destination system.</span>
                        <br/>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <div className="d-flex">
                        <Button onClick={handleSuccessClose}> Close </Button>
                        <Button onClick={handleSuccessClose} autoFocus> OK </Button>
                    </div>
                </DialogActions>
            </Dialog>


            { /* The dialog thatbis going to dispaly an error message should an invalid file be chosen*/}
            <Dialog open={error} onClose={handleErrorClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" className={'bg-danger text-white bold'}>
                    {'Operation Feedback'}
                </DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description" className={'text-danger'}>
                        <br/>
                        <span className="text-danger">The file type you chose is not supported.</span>
                        <br/>
                        <span className="small bold">To proceed, please a text file.</span>
                        <br/>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <div className="d-flex">
                        <Button onClick={handleErrorClose}> Close </Button>
                        <Button onClick={handleErrorClose} autoFocus> OK </Button>
                    </div>
                </DialogActions>
            </Dialog>

            { /* The dialog thatbis going to dispaly a success message after successful comparison */}
            <Dialog open={open} onClose={handleSuccessClose} aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" className={'bg-success text-white bold'}>
                    {'Operation Feedback'}
                </DialogTitle>
                <DialogContent>
                    <DialogContent id="alert-dialog-description" className={'text-success'}>
                        <br/>
                        <span className="text-success">System has finished comparison of the selected files.</span>
                        <br/>
                        <span className="small bold">Please check matched content section below for results</span>
                        <br/>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <div className="d-flex">
                        <Button onClick={handleSuccessClose}> Close </Button>
                        <Button onClick={handleSuccessClose} autoFocus> OK </Button>
                    </div>
                </DialogActions>
            </Dialog>

            {/* A green thick line just for design purposes */}
            <div className='card'>
                <div className='card-header bg-success'></div>
            </div>

            {/* Top header div containing the logo and the title of the app */}
            <div>
                <div className="heading col-md-2">
                    <Logo width={60} height={60}/>
                </div>
                <div className='d-flex justify-content-center heading col-md-9'>
                    <h2 className='text-success'>Compare Content From Two Files</h2>
                </div>
            </div>

            {/* A thin green line to mark beginning of the actual system functionality */}
            <hr className='greenline'/>

            {/* The actual system functionality */}
            <div className='d-flex justify-content-between'>

                {/* The first file selection section, also writes its content to a preview area */}
                <div className='col-md-6 bordered'>
                    <span className='text-success bold'>Select First File</span>
                    <input type="file" className='form-control' onChange={readFirstFile} id="firstFile"/>
                    <div id="textPreview1">{text1?.map((t, i) => <div key={'a' + i}>{t}<br/></div>)}</div>
                </div>

                {/* The second file selection section, also writes its content to the second preview area */}
                <div className='col-md-6 bordered'>
                    <span className='text-success bold'>Select Second File</span>
                    <input type="file" className='form-control' onChange={readSecondFile} id="secondFile"/>
                    <div id="textPreview2">{text2?.map((t, i) => <div key={'b' + i}>{t}<br/></div>)}</div>
                </div>

            </div>

            {/* The main button/actions section */}
            <div className='d-flex justify-content-around heading'>
                <button className='btn btn-outline-danger' onClick={clearOnClick}>Clear</button>
                {afterCompare &&
                    <button className='btn btn-outline-primary' onClick={sendToAnotherApp}>Send To Another App</button>}
                <button className='btn btn-outline-success' onClick={compareOnClick}>Compare</button>
            </div>

            {/* The results section to be visible only when comparison has been done. */}
            {showResults && <div>
                <div className='d-flex justify-content-center heading'>
                    <h4 className='text-success'>Matched Content From Two Files</h4>
                </div>
                <div className='col-md-12 bordered'>
                    {result?.map((r, i) => {
                        return <div key={'r' + i}><span className='text-danger'>{r}</span><br/></div>
                    })}
                </div>
            </div>}


        </div>
    );

}

export default App;
