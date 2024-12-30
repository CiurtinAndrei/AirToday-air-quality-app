'use client';

import Link from "next/link"
import {useState, useEffect} from 'react'
import axios from 'axios'


export default function CalitateAer() {
    
    let queryCity:string|null
    
    type AirQualityData = {
        data: {
          city: {
            name: string;
          };
          aqi: number;
          iaqi: {
            [key: string]: { v: number };
          };
        };
      };

      const [cityInfo, updateInfo] = useState<AirQualityData | null>(null);

    useEffect(()=>{

       queryCity = new URLSearchParams(window.location.search).get('city');
       axios.get(`https://api.waqi.info/feed/${queryCity}/?token=${process.env.NEXT_PUBLIC_API_KEY}`)
       .then((res)=>{
            console.log(res.data)
            updateInfo(res.data)
       })
       .catch((err)=>{
            console.log('Error fetching API data: ' + err)
       })
       .finally(()=>{
        console.log('Data obtained successfully!')
        
       })
    }, [])

    if(!cityInfo){
        return(
        <>
        
        <h1>In asteptare....</h1>
        
        </>)
    }

    return (
        <>

        <h1> This is a test!</h1>
        <Link href="/">Return</Link>
        <h1>Air Quality for {cityInfo.data.city.name}</h1>
        </>
        

    );


}   