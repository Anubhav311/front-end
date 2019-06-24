import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {Link} from 'react-router-dom';

import worker_script from "../../../Utility/worker";
import Editor from '../../Shared/Editor/Editor';
import './CreateChallenge.css';
import Console from '../../Shared/Console/Console';
import Tabs from './Tabs';
import {useWorker} from '../../../Utility/WorkerHook';
import Instructions from './Instructions';
import SharedModal from "../../Shared/SharedModal/SharedModal";
import MetaForm from './Meta'
import TestsForm from './TestsForm'
import TestAndSubmitChalllenge from './TestAndSubmit';

function CreateChallenge(props) {  
    const accessToken = props.auth.accessToken;
  
    const [challenge, setChallenge] = useState({
        title: '',
        difficulty: 1,
        tests: [{descriptor: "", argumentsToPass: "", expectedResult: ""}],
        description: '',
        solution: '',
        skeleton_function: ''
    })
    const [category, setCategory] = useState("")
    const [buttonState, setButtonState] = useState(true)
    const [javascriptInput, setJavascriptInput] = useState('')
    const [passed, setPassed] = useState(false);
    const [output, setOutput] = useState([]);
    const [userMessage, setUserMessage] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([])
    const [modalState, setModalState] = useState(false);
    const [loading, setLoading] = useState(false);

    const {result, error} = useWorker(worker_script, userMessage);

    useEffect(() => {
        if (result.length === 0) {
            setOutput([]);
        } else {
            const resLen = result.length;
            switch (result[resLen - 1].msg) {
                case 'run_code':
                    setOutput(result);
                    break;
                case 'run_tests':
                    const testResult = (result[resLen - 1].result.toString()) === 'true'
                        ? true
                        : false;
                    setPassed(testResult);
                    break;
                default:
                    break;
            };
        }
    }, [result]);

    useEffect(() => {
        const myArray = challenge.tests.map(e => {
            if (e.descriptor !== '' && e.expectedResult !== '') {
                return true;
            } else {
                return false;
            }
        })

        const bool = myArray.every(e => {
            if (e === true) {
                return true;
            } else {
                return false;
            }
        });
        setButtonState(bool);
    }, [challenge.tests]);

    useEffect(() => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_SERVER}/api/categories/`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
            })
            .then(res => {
                setCategory(res.data)
                const categoryOptions = res.data.map(obj => {
                    return {
                        label: obj.name,
                        value: obj.id
                    }
                })
                setCategory(categoryOptions)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    function handEditorleInputChange(editor, data, code) {
        setChallenge({
            ...challenge,
            description: code,
        });
    }

    function addTest(e) {
        e.preventDefault();
        const values = [...challenge.tests];
        values.push({descriptor: '', argumentsToPass: '', expectedResult: ''});
        setChallenge({
            ...challenge,
            tests: values
        });
    }

    function removeTest(e) {
        e.preventDefault();
        const values = [...challenge.tests];
        values.splice(e.target.id, 1);
        setChallenge({
            ...challenge,
            tests: values,
        });
    }

    function handleChanges(e) {
        const values = [...challenge.tests];
        values[e.target.id][e.target.name] = e.target.value;
        setChallenge({
            ...challenge,
            tests: values,
        });
    }

    function handleInputChange(editor, data, code) {
        setJavascriptInput(code);
    }

    function handleSolutionInputChange(editor, data, code) {
        const regexp = /\s\w(.*?)\{↵/;
        const skeleton_function = 'function' + regexp.exec('function sayHello() {↵ some random code↵}')[0] + '↵}';    
        setChallenge({
            ...challenge,
            solution: code,
            skeleton_function: skeleton_function,
        });
    }

    function handleTitleChanges(e) {
        e.preventDefault();
        let values = [...challenge.title];
        values = e.target.value;
        setChallenge({
            ...challenge, 
            title: values
        })
    }

    function handleDifficultyChanges(e) {
        e.preventDefault();
        setChallenge({
            ...challenge,
            difficulty: parseInt(e.target.value, 10)
        });
    }

    function handleCategoryChanges(e) {
        e.preventDefault();
        let values = [...category];
        values = e.target.value;
        setCategory(values);
    };

    function postForChallengeCreation(event, token) {
        event.preventDefault();
        setLoading(true)
        createChallengeRequest(challenge.description, challenge.tests, challenge.solution, challenge.title, challenge.difficulty, challenge.skeleton_function, selectedCategories, accessToken, setModalState, setLoading)
    }

    function clearConsole() {
        setUserMessage('clear_console');
    };

    function runCode() {
        setUserMessage({msg: 'run_code', code: challenge.solution});
    };

    function runTests() {
        const testArray = challenge.tests.map(obj => {
            if (obj.argumentsToPass === '') {
                obj.argumentsToPass = '[]';
            }
            obj.argumentsToPass = eval(obj.argumentsToPass);
            return obj;
        })
        setUserMessage({msg: 'run_tests', code: challenge.solution, tests: testArray});
    };

    function modalCallback(){
        setModalState(!modalState);
    }


    return(
        <div className="create-challenge-container">
            <Tabs className="tabs">
                <div label="Instructions">
                    <div className="tab-container">
                        <Instructions/>
                    </div>
                </div>
                <div label="Meta">
                    <div className="tab-container">
                        <MetaForm
                            handleTitleChanges={e => handleTitleChanges(e)}
                            title={challenge.title}
                            handleDifficultyChanges={e => handleDifficultyChanges(e)}
                            category={category} 
                            selectedCategories={selectedCategories} 
                            setSelectedCategories={selected => {setSelectedCategories(selected)}}        
                        />
                    </div>
                </div>
                <div label="Description">
                    <div className="tab-container">
                        <div className="description-editor-container">
                            <div className="editor">
                                <section className="playground">
                                    <div className="code-editor js-code">
                                        <h2 className="editor-header">Description</h2>
                                        <Editor
                                            code={challenge.description}
                                            mode={'markdown'}
                                            changeHandler={handEditorleInputChange}/>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
                <div label="Preview">
                    <div className="tab-container">
                        <ReactMarkdown
                            source={challenge.description}
                            className="markdown-render"
                        />
                    </div>
                </div>
                <div label="Tests">
                    <div className="tab-container">
                        <TestsForm
                            tests={challenge.tests}
                            handleChanges={e => handleChanges(e)}
                            removeTest={e => removeTest(e)}
                            buttonState={buttonState}
                            addTest={e => addTest(e)}
                        />
                    </div>
                </div>
                <div label="Code">
                    <div className="tab-container">
                        <div className="editor">
                            <section className="playground">
                                <div className="code-editor js-code">
                                    <h2 className="editor-header">Solution</h2>
                                    <Editor
                                        code={challenge.solution}
                                        mode={'javascript'}
                                        changeHandler={handleSolutionInputChange}/>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <div label="Submit">
                    <div className="tab-container tab-container-submit">
                        <TestAndSubmitChalllenge
                            passed={passed}
                            loading={loading}
                            postForChallengeCreation={e => {postForChallengeCreation(e, accessToken)}}
                            runTests={runTests}
                        />
                    </div>
                </div>
            </Tabs>
            <Console runCode={runCode} clearConsole={clearConsole} output={output} style={{width: "63%"}}/>
            <SharedModal 
                class="create-challenge-modal" 
                message={<div className="modal-text-container">
                            <h1>Success!</h1>
                            <p>Your challenge is submitted for approval</p>
                            <p>See the status in your profile</p>
                            <Link to="/profile">
                                <button>Profile</button>
                            </Link>
                        </div>} 
                modalCallback={modalCallback} 
                modalState={modalState}
            />
        </div>
    )
}


function createPayload(markdownInput, tests, javascriptSolutionInput, title, difficulty, skeletonFunction, selectedCategories) {
    const payload = {
        description: markdownInput,
        tests: tests,
        solution: javascriptSolutionInput,
        title: title,
        difficulty: difficulty,
        skeleton_function: skeletonFunction
    }

    return payload;
}

function createChallengeRequest(markdownInput, tests, javascriptSolutionInput, title, difficulty, skeletonFunction, selectedCategories, token, setModalState, setLoading) {
    const challengePayload = createPayload(markdownInput, tests, javascriptSolutionInput, title, difficulty, skeletonFunction)

    axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER}/api/challenges`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: challengePayload
    })
    .then(challengeRes => {
            console.log(challengeRes)
            addCategoriesRequest(challengeRes.data, selectedCategories, token, setModalState, setLoading)
        })
        .catch(err => {
            console.log(err)
        })
}

function addCategoriesRequest(challenge, selectedCategories, token, setModalState, setLoading) {
    const arrayOfselectedCategories = selectedCategories.map(id => {
        return {
            challenge_id: challenge.id,
            categories_id: id
        }
    })
    axios({
        method: 'post', 
        url: `${process.env.REACT_APP_SERVER}/api/categories/challenges`,
        headers: {
            Authorization: `Bearer ${token}`
        },
        data: arrayOfselectedCategories
        })
        .then(categoryRes => {
            if(categoryRes) {
                setModalState(true)
                setLoading(false)
            }
        })
        .catch(err => {
            console.log(err)
        })

}

export default CreateChallenge;
