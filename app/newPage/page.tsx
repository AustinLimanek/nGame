'use client'

import { Inter } from "next/font/google"
import Link from "next/link";
const inter = Inter({ subsets: ['latin'] })

import React, { useState, useEffect, useCallback } from 'react';


export default function NewPage() {
  const INTVELOCITY = 20;
  const GRAVITY = 4; // Adjust the value as needed
  const GROUND1 = [0, 500];
  const GROUND2 = [700, 800];
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState<number>(INTVELOCITY);
  const [yVelocity, setYVelocity] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [shotsArray, setShotsArray] = useState<any>([]);

  const slider = useCallback((phase: number, angularVelocity: number = 1 , amplitude: number = 1000)=>{ 
    const cycle = (angularVelocity * time + phase) % amplitude;
    return cycle < amplitude * 0.5 ? cycle : amplitude - cycle;
  },[time]);


  const acceleration = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) {
        setVelocity((prevVelocity) => prevVelocity > 0 ? prevVelocity* 1.1 : prevVelocity + 0.1 * Math.abs(prevVelocity));
      }
      else{
        setVelocity(INTVELOCITY);
      }
    },
    [setVelocity]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log(e);
      acceleration(e); // Call acceleration to potentially update velocity
      switch (e.code) {
        case 'ArrowLeft':
          setPosition((prevPos) => ({ ...prevPos, x: prevPos.x - velocity >= 0 ? prevPos.x - velocity : 0 }));
          break;
        case 'ArrowRight':
          setPosition((prevPos) => ({ ...prevPos, x: prevPos.x + velocity }));
          break;
        case 'ArrowUp':
          setPosition((prevPos) => ({ ...prevPos, y: prevPos.y - velocity }));
          break;
        case 'ArrowDown':
          setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + velocity }));
          break;
        case 'Space':
          if(!isJumping){
          setYVelocity(-20); // Adjust the jump strength as needed
          setIsJumping(true);}
          break;
        default:
          break;
      }
    },
    [velocity, acceleration, isJumping]
  );

  const handleClick = useCallback( () => {
    setShotsArray([...shotsArray, {x: slider(300, 2) + 25, y: 150, setTime: time}]);
    }, [shotsArray, time, slider])
  

  const handleFilter = useCallback((range: number) => {
    setShotsArray(shotsArray.filter((element: any) => element.y + time - element.setTime < range));
  },[shotsArray, time])

  // Handle user input (e.g., arrow keys)
  useEffect(() => {

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Gravity effect
    const gravityInterval = setInterval(() => {
      setYVelocity((prevYVelocity) => prevYVelocity + GRAVITY);
    }, 100); // Adjust the interval as needed
  
    return () => {
      clearInterval(gravityInterval);
    };
  }, []);

  useEffect(() => {
    // Gravity effect
    const gameClock = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
      handleFilter(500);
      if(Math.random() < 0.01){
        handleClick();
      }
    }, 10); // Adjust the interval as needed
  
    return () => {
      clearInterval(gameClock);
    };
  }, [handleFilter, handleClick]);

  //this continuously runs when gravity is non-zero. Down is considered positive. 
  useEffect(() => {
    // console.log(position.x)
    // console.log(yVelocity)
    if (position.y > GROUND1[1] - 50 && position.x < 500) {
      setIsJumping(false);
      setYVelocity(0); // Prevent any residual vertical velocity
      setPosition((prevPos) => ({ ...prevPos, y: GROUND1[1] - 50 }));
    }

    if(position.x < 500 && position.y < GROUND1[1] - 50 || position.x > 500 && position.y < GROUND2[1] - 75 || isJumping){
      setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + yVelocity }));
    }
  }, [yVelocity, position.x, isJumping]);

  // useEffect(() => {
  //   if (position.y >= GROUND[1] + 50) {
  //     setIsJumping(false);
  //     setYVelocity(0); // Prevent any residual vertical velocity
  //     setPosition((prevPos) => ({ ...prevPos, y: 50 }));
  //   }
  // }, [position.y]);


  function quickSort(array: number[]): number[]{
    if(array.length <= 1) return array;

    const pivot: number = array[0];
    const leftArray: number[] = [];
    const rightArray: number[] = [];

    for(let i = 1; i < array.length; i++){
      array[i] < pivot ? leftArray.push(array[i]) : rightArray.push(array[i]);
    }

    return [...quickSort(leftArray), pivot, ...quickSort(rightArray)];
  }

  // function generateRandomArray(numEle: number): number[]{

  // }

  return (
  <>
    <Link href="/">Navigate Home</Link>
    <span className={inter.className}>-&gt; Hello, World! &lt;-</span>;
    <span className={inter.className}>{time}</span>;
    <button onClick={handleClick}>Generate</button>
    <button onClick={()=>handleFilter(300)}>Filter</button>
    <button onClick={()=>console.log(quickSort([1,-2,6,7,20,-3,9]))}>Sort</button>
    <div
      style={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: 'blue',
        left: `${slider(300, 2)}px`,
        top: `${100}px`,
      }} 
    ></div>
    <div
      style={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: 'blue',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    ></div>
    <div
      style={{
        position: 'absolute',
        width: '500px',
        height: '50px',
        backgroundColor: 'green',
        left: `${GROUND1[0]}px`,
        top: `${GROUND1[1]}px`,
      }}
    ></div>
    <div
      style={{
        position: 'absolute',
        width: '500px',
        height: '50px',
        backgroundColor: 'green',
        left: `${GROUND2[0] + slider(0)}px`,
        top: `${GROUND2[1]}px`,
      }}
    ></div>
    {shotsArray.map((element: any, index: number) => <div key={index}
      style={{
        position: 'absolute',
        width: '5px',
        height: '5px',
        backgroundColor: 'green',
        left: `${element.x}px`,
        top: `${element.y + time - element.setTime}px`,
      }}
    ></div> )}
  </>)
}