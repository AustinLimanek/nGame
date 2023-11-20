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
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function generatePoissonEvents(rate: number, period: number) {
    let time = 0; // Initialize time
    let events = 0; // Initialize the count of events
  
    while (time < period) {
      // Generate a random time interval from a uniform distribution
      const interval = -Math.log(1 - Math.random()) / rate;
      console.log(interval);
  
      // Update the total time
      time += interval;
  
      // Check if the event occurred within the period
      if (time < period) {
        events++;
      }
    }
  
    return events;
  }
  
  // Example usage
  const averageRate = 0.2; // Average rate of Poisson events per unit of time
  const timePeriod = 1; // Period of time to simulate

  const calculateProfit = () => {
    const eachMonth: number[] = Array.from({length: 30}, ()=>15);
    
    let cumulative: number[] = Array.from({length: 30}, ()=>0);
    console.log("hello")

    const monthlyRevenueArray: number[] = [];

    for( let i = 0; i < 12; i++){
      cumulative = cumulative.map(element => element - (Math.random() < 0.2 ? 5 : 0) + 15 );
      const monthlyRevenue = cumulative.reduce((sum, element)=>sum + element);
      monthlyRevenueArray.push(+monthlyRevenue.toFixed(2));
    }

    console.log(monthlyRevenueArray);
    const totalRevenue = monthlyRevenueArray.reduce((sum, element) => sum + element);

    console.log(+totalRevenue.toFixed(2));

    const numEvents = generatePoissonEvents(averageRate, timePeriod);
    console.log(numEvents);

  }

  const sqrt = (input: number, initialGuess: number = 1, tolerance: number = 0.0001): number => {
    return sqrtIter(initialGuess, tolerance, input);
  }

  const sqrtIter = (guess: number, tolerance: number, input: number): number => {
    console.log(guess);
    return isGoodEnough(guess, tolerance, input) ? guess : sqrtIter(improve(guess, input), tolerance, input);
  }

  const isGoodEnough = (guess: number, tolerance: number, input: number): boolean => {
    return Math.abs(guess * guess - input) <= tolerance;
  }

  const improve = (guess: number, input: number): number => {
    return 0.5 * (guess + input/guess);
  }



  // Handle user input (e.g., arrow keys)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // console.log(e);
      //acceleration(e); // Call acceleration to potentially update velocity
      //handlePlatformSelection();
      switch (e.code) {
        case 'ArrowLeft':
          setPosition((prevPos) => ({ ...prevPos, x: prevPos.x - 1 }));
          break;
        case 'ArrowRight':
          setPosition((prevPos) => ({ ...prevPos, x: prevPos.x + 1 }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setPosition((prevPos) => ({ ...prevPos, y: prevPos.y - 1 }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition((prevPos) => ({ ...prevPos, y: prevPos.y + 1 }));
          break;
        case 'Space':
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    []
  );

  useEffect(() => {

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  
  

  return (
  <>
    <Link href="/">Navigate Home</Link>
    <span className={inter.className}>-&gt; Hello, World! &lt;-</span>;
    <span className={inter.className}>{}</span>;
    <button onClick={()=>calculateProfit()}>Generate</button>
    <button onClick={()=>{sqrt(2)}}>Take the square root of two</button>
    <button onClick={()=>{}}></button>
    <button onClick={()=>{}}>Sort</button>
    <p>Total Gold: {}</p>
    <p>Total Health: {}</p>
    <div
      style={{
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: `${"green"}`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1,
      }}
    ></div>
   
  </>)
}