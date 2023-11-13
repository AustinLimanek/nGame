'use client'

import { Inter } from "next/font/google"
import Link from "next/link";
const inter = Inter({ subsets: ['latin'] })

import React, { useState, useEffect, useCallback } from 'react';

class Platform {

  x: number;
  y: number;
  length: number;
  depth: number = 50;
  color: string = "green";
  isSlider: boolean;

  constructor(x: number, y: number, isSlider: boolean = false, length: number = 500){
    this.x = x;
    this.y = y;
    this.isSlider = isSlider;
    this.length = length;
  }

}

export default function NewPage() {
  const INTVELOCITY = 20;
  const GRAVITY = 4; 
  const JUMP = 20; 
  //Ground x => horizontal start, y=> vertical start
  const platform1: Platform = new Platform(0, 500);
  const platform2: Platform = new Platform(500, 800, true);
  const platform3: Platform = new Platform(300, 800, false, 100);
  const platform4: Platform = new Platform(300, 900, false, 100);
  const platform5: Platform = new Platform(700, 600, false, 600);
  const platform6: Platform = new Platform(1000, 700, false, 400);
  const platform7: Platform = new Platform(1200, 400, false, 300);
  const ground: Platform = new Platform(0, 1000, false, 4000)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState<number>(INTVELOCITY);
  const [yVelocity, setYVelocity] = useState<number>(0);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [shotsArray, setShotsArray] = useState<any[]>([]);
  const [coinCount, setCoinCount] = useState<number>(0);
  const [health, setHealth] = useState<number>(10);
  const [pause, setPause] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<string>("blue");
  const [platformArray, setPlatformArray] = useState<Platform[]>([platform1, platform2, platform3, platform4, platform5, platform6, platform7, ground])
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(platform1);
  const [onPlatform, setOnPlatform] = useState<boolean>(false);

  const slider = useCallback((phase: number, angularVelocity: number = 1 , amplitude: number = 1000)=>{ 
    const cycle = (angularVelocity * time + phase) % amplitude;
    return cycle < amplitude * 0.5 ? cycle : amplitude - cycle;
  }, [time]);


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

  const handlePlatformSelection = useCallback(()=>{
    const shift = currentPlatform.isSlider ? slider(0) : 0;
    const validHorizontal = platformArray.filter((platform: Platform) => platform.x + shift - 50 <= position.x && position.x <= platform.x + platform.length + shift);
    if(validHorizontal.length === 1){
      setCurrentPlatform(validHorizontal[0]);
    }
    else{
      const filteredVertical = validHorizontal.filter(platform => platform.y > position.y).sort((a, b)=> a.y - b.y);
      // console.log(filteredVertical);
      filteredVertical.length === 0 ? setCurrentPlatform(ground) : setCurrentPlatform(filteredVertical[0]);
      
    }
  }, [position.x, platformArray, position.y]);

  const handleOnPlatform = useCallback(()=>{
    const shift = currentPlatform.isSlider ? slider(0) : 0;
    const atPlatform: boolean = currentPlatform.y - 10 < position.y + 50 && position.y + 50 < currentPlatform.y + 10 && currentPlatform.x + shift <= position.x && position.x <= currentPlatform.x + currentPlatform.length + shift;
    if(atPlatform && !onPlatform){
      setOnPlatform(true);
      return true;
    }
    else{setOnPlatform(false);};
    // console.log(onPlatform)
  }, [position.y, currentPlatform, slider])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // console.log(e);
      acceleration(e); // Call acceleration to potentially update velocity
      //handlePlatformSelection();
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
          setYVelocity(-JUMP); // Adjust the jump strength as needed
          setIsJumping(true);}
          break;
        default:
          break;
      }
    },
    [velocity, acceleration, isJumping]
  );

  const handleClick = useCallback( () => {
    setShotsArray([...shotsArray, {x: slider(300, 2) + 25, y: 150, setTime: time, type: Math.random() > 0.2 ? "coin" : "shot"}]);
  }, [shotsArray, time, slider])

  // const handleHitBox = useCallback( () => {
  //   console.log(position.x);
  //   console.log(position.y)
  //   const intermediateArray = shotsArray.map((shot: any) => {
  //     console.log(shot);
  //     if((position.x <= shot.x && shot.x <= position.x + 50) && (position.y <= shot.y + time - shot.setTime && shot.y + time - shot.setTime <= position.y + 50)){
  //       // console.log("hit")
  //       setCoinCount(prevCount => prevCount + 1);
  //       return {...shot, hit: true};
  //     };
  //     return shot;
  //   });
  //   setShotsArray((preArray: any[]) => intermediateArray.filter((shot: any) => shot.hit === false));
  // }, [shotsArray, position.x, position.y, time])

  const handleCoin = () =>  {
    setCoinCount((prevCount) => prevCount + 0.5);
  }

  function changeBack() {
    setTimeout(()=>setPlayerColor("blue"), 50);
  }

  const handleShot = () =>  {
    setHealth((prevHealth) => prevHealth - 0.5);
    setPlayerColor("red");
    changeBack();
  }

  const handleHitBox = useCallback( () => {
    setShotsArray((prevShotsArray: any[]) => {
      const updatedArray = [...prevShotsArray];
      let collected = false; // Track if a coin has been collected
      for (let i = 0; i < updatedArray.length; i++) {
        const shot = updatedArray[i];
        if (
          position.x <= shot.x &&
          shot.x <= position.x + 50 &&
          position.y <= shot.y + time - shot.setTime &&
          shot.y + time - shot.setTime <= position.y + 50
        ) {
          if (!collected) {
            shot.type === "coin" ? handleCoin() : handleShot();
            collected = true; // Mark that a coin has been collected
          }
          updatedArray.splice(i, 1); // Remove the shot from the array
          i--; // Decrement i to account for the removed element
        }
      }
      return updatedArray;
    });
  }, [position, time])

  
  

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
      handlePlatformSelection();
    }, 100); // Adjust the interval as needed
  
    return () => {
      clearInterval(gravityInterval);
    };
  }, [handlePlatformSelection]);

  useEffect(() => {
    // Gravity effect
    const gameClock = setInterval(() => {
      if(!pause){
        setTime((prevTime) => prevTime + 1);
        handleFilter(500);
        handleHitBox();
        if(Math.random() < 0.01){
          handleClick();
        }
      }
    }, 10); // Adjust the interval as needed
  
    return () => {
      clearInterval(gameClock);
    };
  }, [handleFilter, handleClick, handleHitBox, pause]);

  const isAbove = useCallback(()=>{
    
  }, [])

  //this continuously runs when gravity is non-zero. Down is considered positive. 
  useEffect(() => {
    //this turns off jumping when the player hits ground1 
    const shift = currentPlatform.isSlider ? slider(0) : 0;
    if (position.y > currentPlatform.y - 50 && currentPlatform.x + shift - 50 <= position.x && position.x <= currentPlatform.x + currentPlatform.length + shift) {
      setIsJumping(false);
      setYVelocity(0); // Prevent any residual vertical velocity
      setPosition((prevPos) => ({ ...prevPos, y: currentPlatform.y - 50 }));
    }

    //gravity works when to the left of ground1 and about it. (remember, this is relative to the top corner of the player.)
    if( position.y < currentPlatform.y - 50 || isJumping || !onPlatform){
      setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + yVelocity }));
    }
  }, [yVelocity, position.x, isJumping, currentPlatform]);

  useEffect(() => {
    handleOnPlatform() ? setYVelocity(0): null;
  }, [position.y, handleOnPlatform]);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth / 2;
      // Check if the block is at or beyond the threshold
      console.log("screenCenter", threshold);
      console.log("innerWidth", window.innerWidth)
      console.log("xOffSet", window.scrollX)
      console.log(position.x);
      if (position.x >= threshold + window.scrollX) {
        // Calculate how much to scroll by
        const scrollBy = position.x - (threshold + window.scrollX);
        
        // Scroll the window to the right
        window.scrollBy({ left: scrollBy, behavior: 'smooth' });

        // Update the block's position to stay in the same place on the screen
        // setPosition({ x: threshold, y: position.y });
      }
      if(position.x < window.scrollX + window.innerWidth / 3){
        window.scrollBy({ left: -100, behavior: 'smooth' });
      }
    };

    // Add a scroll event listener
    handleScroll();

    return () => {
      // Remove the scroll event listener when the component unmounts
      //  window.removeEventListener('scroll', handleScroll);
    };
  }, [position.x]);


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
    <button onClick={()=>setPause(!pause)}>{pause ? "Play" : "Pause"}</button>
    <button onClick={()=>console.log(quickSort([1,-2,6,7,20,-3,9]))}>Sort</button>
    <p>Total Gold: {coinCount}</p>
    <p>Total Health: {health}</p>
    <div
      style={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: `${playerColor}`,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    ></div>
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
    {platformArray.map((platform: Platform, index: number) => 
      <div key={index}
        style={{
          position: 'absolute',
          width: `${platform.length}px`,
          height: '50px',
          backgroundColor: 'green',
          left: `${platform.x + (platform.isSlider ? slider(0) : 0)}px`,
          top: `${platform.y}px`,
        }}
      ></div>
    )}
    {shotsArray.map((element: any, index: number) => <div key={index}
      style={{
        position: 'absolute',
        width: '5px',
        height: '5px',
        backgroundColor: `${element.type === "coin" ? "gold" : "red"}`,
        left: `${element.x}px`,
        top: `${element.y + time - element.setTime}px`,
      }}
    ></div> )}
  </>)
}