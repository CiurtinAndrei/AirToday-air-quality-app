'use client';

import {useRouter} from 'next/navigation'
import {useState, useEffect} from 'react'
import  styles from '../styles/Home.module.css'
import Image from 'next/image';
import ROFlag from '../styles/icons/ro-flag.png'

export default function Home(){


    const router = useRouter();

    const [city, selectCity] = useState<string>("")

    const [datetime, setDateTime] = useState<string>("...")

    const changeCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
        selectCity(event.target.value)
    }

    const handleSubmit = () =>{
        if (city){
            router.push(`/calitate-aer?location=${city}`)
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
        <span className = {styles.app_title}>AirToday - calitatea aerului în orașele din România</span>
        <span className = {styles.date_time}> {datetime}</span>
        </div>



        <div className = {styles.page_container} >

        <h1 className = {styles.select_title}> Alege un oraș</h1>
        <div className = {styles.city_sel_wrap}>

        <select className={styles.city_selector} name="city" defaultValue="default" onChange={changeCity}>
            <option value = "default" disabled></option>
            <option value="A470920">București - Sectorul 1</option>
            <option value="A109186">București - Sectorul 2</option>
            <option value="A417121">București - Sectorul 3</option>
            <option value="A109819">București - Sectorul 4</option>
            <option value="A109702">București - Sectorul 5</option>
            <option value="A109288">București - Sectorul 6</option>
            <option value="alba-iulia">Alba Iulia</option>
            <option value="arad">Arad</option>
            <option value="bacau">Bacău</option>
            <option value="baia-mare">Baia Mare</option>
            <option value="@7658"> Balotești</option>
            <option value="bistrita">Bistrița</option>
            <option value="botosani">Botoșani</option>
            <option value="brasov">Brașov</option>
            <option value="A237307">Buzău</option>
            <option value="@6847">Călărași</option>
            <option value="A403114">Câmpina</option>
            <option value="@4163">Câmpulung</option>
            <option value="caransebes">Caransebeș</option>
            <option value="cluj">Cluj-Napoca</option>
            <option value="constanta">Constanța</option>
            <option value="craiova">Craiova</option>
            <option value="deva">Deva</option>
            <option value="drobeta-turnu-severin">Drobeta-Turnu Severin</option>
            <option value="focsani">Focșani</option>
            <option value="galati">Galați</option>
            <option value="giurgiu">Giurgiu</option>
            <option value="hunedoara">Hunedoara</option>
            <option value="iasi">Iași</option>
            <option value="mangalia">Mangalia</option>
            <option value="medgidia">Medgidia</option>
            <option value="@4187"> Mediaș</option>
            <option value="@7652">Miercurea Ciuc</option>
            <option value="oradea">Oradea</option>
            <option value="@4193">Petroșani</option>
            <option value="piatra-neamt">Piatra Neamț</option>
            <option value="pitesti">Pitești</option>
            <option value="ploiesti">Ploiești</option>
            <option value="@6845">Râmnicu Sărat</option>
            <option value="ramnicu-valcea">Râmnicu Vâlcea</option>
            <option value="resita">Reșița</option>
            <option value="satu-mare">Satu Mare</option>
            <option value="sfantu-gheorghe">Sfântu Gheorghe</option>
            <option value="A502816">Sighișoara</option>
            <option value="sibiu">Sibiu</option>
            <option value="slatina">Slatina</option>
            <option value="slobozia">Slobozia</option>
            <option value="suceava">Suceava</option>
            <option value="targoviste">Târgoviște</option>
            <option value="targu-jiu">Târgu Jiu</option>
            <option value="targu-mures">Târgu Mureș</option>
            <option value="tecuci">Tecuci</option>
            <option value="timisoara">Timișoara</option>
            <option value="vaslui">Vaslui</option>
            <option value="zalau">Zalău</option>


        </select>

        </div>
        
        {city? <button className = {styles.ok_button} onClick={handleSubmit}>Confirmă</button> : <div></div>}
        <div className = {styles.chart}>
        </div>
   
        </div>
        </>
    );


}