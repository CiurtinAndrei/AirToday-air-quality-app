'use client';

import Link from "next/link"
import {useState, useEffect} from 'react'
import axios from 'axios'


export default function CalitateAer() {
    
  type AirQualityData = {
    status: string;
    data: {
      aqi: number;
      idx: number;
      attributions: {
        url: string;
        name: string;
        logo?: string; // Optional property
      }[];
      city: {
        geo: [number, number];
        name: string;
        url: string;
        location?: string; // Optional property
      };
      dominentpol: string;
      iaqi: {
        [key: string]: { v: number };
      };
      time: {
        s: string; // Local time string
        tz: string; // Timezone offset
        v: number; // UNIX timestamp
        iso: string; // ISO 8601 format
      };
      forecast?: {
        daily: {
          [key: string]: {
            avg: number;
            day: string;
            max: number;
            min: number;
          }[];
        };
      };
      debug?: {
        sync: string;
      };
    };
  } | {
    status:string;
    data:string
  };
  

      const [cityInfo, updateInfo] = useState<AirQualityData | null>(null);

    useEffect(()=>{

       const queryCity:string|null = new URLSearchParams(window.location.search).get('location');
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

    else if(cityInfo.status == "error" && typeof(cityInfo.data) == "string"){

        return(
          <>
          
         <h1>Eroare! Aceasta statie meteo nu exista!</h1>
         <Link href="/">Return</Link>
          </>
        )

    }
    else if(typeof(cityInfo.data)!="string")
    return (
        <>

        <h1> This is a test!</h1>
        <Link href="/">Return</Link>
        <h1>Calitate aer pentru: {cityInfo.data.city.name}</h1>
        <h1>{cityInfo.data.forecast?.daily.pm10[0].avg}</h1>
        <h1>{cityInfo.data.iaqi['pm10']?.v}</h1>
        </>
        

    );


}   