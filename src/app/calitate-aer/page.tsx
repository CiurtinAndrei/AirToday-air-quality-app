'use client';

import Link from "next/link"
import {useState, useEffect} from 'react'
import axios from 'axios'


export default function CalitateAer() {
    
    let queryCity:string = 'default'
    

    const [city_info, updateInfo] = useState({})

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


    return (
        <>

        <h1> This is a test!</h1>
        <Link href="/">Return</Link>


        </>
        

    );


}   