'use client';

import {useRouter} from 'next/navigation'
import {useState} from 'react'

export default function Home(){


    const router = useRouter();

    const [city, selectCity] = useState<string>("")

    const changeCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selectCity(event.target.value)
    }

    const handleSubmit = () =>{
        if (city){
            router.push(`/calitate-aer?city=${city}`)
        }
    }

    return(
        <>
        
        <h1> Alege un oras:</h1>
        
        <select name="city" defaultValue="default" onChange={changeCity}>
          <option value="default" disabled></option>
          <option value="bucuresti">Bucuresti</option>
          <option value="vaslui">Vaslui</option>
        </select>
        
        <button onClick={handleSubmit}>OK</button>

        </>
    );


}