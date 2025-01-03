'use client';

import {useRouter} from 'next/navigation'
import {useState, useEffect} from 'react'
import  styles from '../styles/Home.module.css'
import Image from 'next/image';
import ROFlag from '../styles/icons/ro-flag.png'

export default function Home(){


    const router = useRouter();

    const [city, selectCity] = useState<string>("")

    const [datetime, setDateTime] = useState<string>("")
    
    const changeCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selectCity(event.target.value)
    }

    const handleSubmit = () =>{
        if (city){
            router.push(`/calitate-aer?city=${city}`)
        }
    }


    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(Date().slice(0, 24));
        }, 1000);
        return () => clearInterval(intervalId)
    }, [])

    return(
        <>
        <div className = {styles.header_bar}>
        <Image className = {styles.ro_flag} src = {ROFlag} alt="RO-flag" width={30} height={20}></Image>
        <span className = {styles.app_title}> AerPentruToți - calitatea aerului în România zi de zi</span>
        <span className = {styles.date_time}> {datetime}</span>
        </div>



        <div className = {styles.page_container} >

        <h1 className = {styles.select_title}> Alege un oraș</h1>
        <div className = {styles.city_sel_wrap}>

        <select className={styles.city_selector} name="city" defaultValue="default" onChange={changeCity}>
            <option value = "default" disabled></option>
            <option value="Bucuresti">Bucuresti</option>
            <option value="alba-iulia">Alba Iulia</option>
            <option value="arad">Arad</option>
            <option value="bacau">Bacau</option>
            <option value="baia-mare">Baia Mare</option>
            <option value="botosani">Botosani</option>
            <option value="brasov">Brasov</option>
            <option value="sinaia">Sinaia</option>
            <option value="buzau">Buzau</option>
            <option value="cluj">Cluj</option>
            <option value="constanta">Constanta</option>
            <option value="craiova">Craiova</option>
            <option value="deva">Deva</option>
            <option value="drobeta-turnu-severin">Drobeta-Turnu Severin</option>
            <option value="focsani">Focsani</option>
            <option value="galati">Galati</option>
            <option value="iasi">Iasi</option>
            <option value="lugoj">Lugoj</option>
            <option value="mangalia">Mangalia</option>
            <option value="medgidia">Medgidia</option>
            <option value="oradea">Oradea</option>
            <option value="piatra-neamt">Piatra Neamt</option>
            <option value="pitesti">Pitesti</option>
            <option value="ploiesti">Ploiesti</option>
            <option value="ramnicu-valcea">Ramnicu Valcea</option>
            <option value="resita">Resita</option>
            <option value="satu-mare">Satu Mare</option>
            <option value="sibiu">Sibiu</option>
            <option value="sfantu-gheorghe">Sfantu Gheorghe</option>
            <option value="slatina">Slatina</option>
            <option value="slobozia">Slobozia</option>
            <option value="suceava">Suceava</option>
            <option value="targoviste">Targoviste</option>
            <option value="targu-jiu">Targu Jiu</option>
            <option value="targu-mures">Targu Mures</option>
            <option value="timisoara">Timisoara</option>
            <option value="tulcea">Tulcea</option>
            <option value="vaslui">Vaslui</option>
            <option value="zalau">Zalau</option>


        </select>

        </div>
        
        {city? <button className = {styles.ok_button} onClick={handleSubmit}>Confirmă</button> : <p></p>}
        

        </div>
        </>
    );


}