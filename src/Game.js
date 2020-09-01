import React, {useState, useEffect} from "react";
import { InputNumber, Button, Card } from "antd";

import 'antd/dist/antd.css';
import './Game.scss'

// Using react Hooks

const Game = () => {

    const [size, setSize] = useState(null);
    const [error, setError] = useState('');
    const [gameStarted, setGameStarted ] = useState(false);
    const [sourceMatrix, setSourceMatrix] = useState();
    const [destinationMatrix, setDestinationMatrix] = useState();
    const [flipCount, setFlipCount] = useState(0);
    const [goalCount, setGoalCount] = useState(20);

    // As destination matrix is being used in generating source martix, using in use effect to avoid error
    useEffect( ()=> {
        if(destinationMatrix) {
            generateSourceMatrix();
        }
    }, [destinationMatrix] );

    useEffect( ()=> {
        if(flipCount > goalCount) {
           alert("You Lost");
        }else {
            if(checkIfArraysAreIdentical(sourceMatrix) && flipCount){
                alert('You Win');
                // resetGame();
            }
        }
    }, [flipCount] );

    const resetGame = () => {
        setSize(null);
        setError('');
        setGameStarted(false);
        setSourceMatrix();
        setDestinationMatrix();
        setFlipCount();
    }

    const validateInput = () => {
        if(size === null){
            setError(`Please enter size to start game`);
            return false;
        }else if(size <= 0 ) {
            setError(`Game can't start with size <= 0`);
            return false
        } 

        return true;
    }

    const rowHeaderClick = (rowIndex, matrixType) => {
        console.log(rowIndex)
        if(matrixType === "destinationMatrix"){
            return;
        }

        //Cloning matrix instead of referencing
        var tempMatrix = sourceMatrix.map(function(arr) {
            return arr.slice();
        });

        // Flipping row 
        for(let j=0;j<size;j++) {
            tempMatrix[rowIndex][j] = tempMatrix[rowIndex][j] ? 0 : 1;
        }

        setSourceMatrix(tempMatrix);
        setFlipCount(flipCount+1);


    }

    const colHeaderClick = (colIndex, matrixType) =>  {
        console.log(colIndex)
        if(matrixType === "destinationMatrix"){
            return;
        }

        //Cloning matrix instead of referencing
        var tempMatrix = sourceMatrix.map(function(arr) {
            return arr.slice();
        });

        // Flipping row 
        for(let j=0;j<size;j++) {
            tempMatrix[j][colIndex] = tempMatrix[j][colIndex] ? 0 : 1;
        }

        setSourceMatrix(tempMatrix);
        setFlipCount(flipCount+1);
    }

    const printMatrix = (matrix, matrixType) => {
        // Using global size state as it is matrix size


        const tempArr =new Array(size).fill(0);
        return (
            <>
            <div style={{display:"inline-flex", marginLeft: 16}}>
                {tempArr.map( (val,index) => {
                    return <div className="matrix__colHeader" onClick={()=>{colHeaderClick(index,matrixType)}}>{String.fromCharCode(65+index)}</div>
                } )
                }
            </div>
            {matrix.map( (row,rowIndex) => {
                
                return( 
                    <>

                    <div className="matrix__row"> 

                        <div className="matrix__rowHeader" onClick={()=>{rowHeaderClick(rowIndex,matrixType)}}>{rowIndex}</div>
                        {matrix[rowIndex].map( (col, colIndex) => {
                            return (     
                                <>
                                    <div className="matrix__col"> {matrix[rowIndex][colIndex] ? 0 : 1} </div>
                                </>
                            )
                        } )
                        }
                    </div>
                    </>

                )
            } )}
            </>
        )
    }

    const checkIfArraysAreIdentical = (tempMatrix) => {
        for(let i=0; i<size; i++){
            for(let j=0;j<size; j++) {
                if(tempMatrix[i][j] !== destinationMatrix[i][j]){
                    return false;
                }
            }
        }
        return true;
    }

    const handleInputChange = (value) => {
        setError('');
        setSize(value);
    }

    const generateRandomMatrix = () => {
        var matrix = [];
        for (var i = 0 ; i < size; i++) {
            matrix[i] = []; // Initializing inner array
            for (var j = 0; j < size; j++) {
                matrix[i][j] = Math.round(Math.random());
            }
        }
        setDestinationMatrix(matrix);

    }

    const generateSourceMatrix = () => {

        //Cloning matrix instead of referencing
        var tempMatrix = destinationMatrix.map(function(arr) {
            return arr.slice();
        });

        //Regenerating source matrix if source and destination are equal
        while(checkIfArraysAreIdentical(tempMatrix)) {
            for(var i=0; i< goalCount; i++){
                const randomValue = Math.floor(Math.random()*(2*size) )  //Generates a random value from 0 -2n
                //Fliping row if randomValue b/n 0 t0 n-1, col id randomValue b/n n to 2n-1
                if(randomValue<size){
                    // Flipping row in this case
                    for(let j=0;j<size;j++) {
                        tempMatrix[randomValue][j] = tempMatrix[randomValue][j] ? 0 : 1;
                    }
                }else {
                    // Flipping column in this case
                    for(let j=0;j<size;j++) {
                        tempMatrix[j][randomValue-size] = tempMatrix[j][randomValue-size] ? 0 : 1;
                    }
                }
    
            }
        }

        setSourceMatrix(tempMatrix);
    }

    const startGame = () => {
        if( validateInput() ) {
            generateRandomMatrix();
            // generateSourceMatrix();
            setGameStarted(true);
        }
    }
    

    return (
        <div className="Game">
           <Card bordered={false} style={{ minWidth: 300 }}>
                <div className="Game__header">
                    <p>Enter the size of Game Matrix :</p>
                    <InputNumber onChange={handleInputChange}/>
                    {error ? <div className="error">{error}</div> : ''}
                </div>

                <div className="Game__generate">
                    <Button type="primary" onClick={()=>{startGame()}}> Click to Start Game </Button>
                    {gameStarted &&
                        <Button type="primary" style={{marginLeft:16}} onClick={()=>{resetGame()}}> Reset Game </Button>
                    }
                </div>

                {gameStarted && 
                <>
                    <div className="Game__scoreBlock">
                        <div className="Game__scoreBlockFlipCount"> flipCount: {flipCount} </div>
                        <div className="Game__scoreBlockGoal"> goalCount: {goalCount} </div>
                    </div>

                    <div className="Game__matrices">
                        <div className="Game__sourceMatrix"> {sourceMatrix ? printMatrix(sourceMatrix, 'sourceMatrix') : ''} </div>
                        <div className="Game__destinaitonMatrix"> {printMatrix(destinationMatrix, 'destinationMatrix')} </div>
                    </div>
                </>
                }
                
           </Card>

        </div>
    )
}

export default Game;