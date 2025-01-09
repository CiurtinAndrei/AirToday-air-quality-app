'use client';

import Link from "next/link"
import {useState, useEffect} from 'react'
import axios from 'axios'
import  styles from '../../styles/CalitateAer.module.css'
import Image from 'next/image';
import ROFlag from '../../styles/icons/ro-flag.png'


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function CalitateAer() {
    
  type PollutantData = {
    min: number[];
    max: number[];
    avg: number[];
  };

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
      const [cityName, updateName] = useState<string>("")
      const [qualityScore, updateScore] = useState<string>("")
      const [datetime, setDateTime] = useState<string>("...")

      const [dates, setDates] = useState<string[]>([]);
      const [o3Data, setO3Data] = useState<PollutantData>({ min: [], max: [], avg: [] });
      const [pm10Data, setPm10Data] = useState<PollutantData>({ min: [], max: [], avg: [] });
      const [pm25Data, setPm25Data] = useState<PollutantData>({ min: [], max: [], avg: [] });
      const [uviData, setUviData] = useState<PollutantData>({ min: [], max: [], avg: [] });
      const [maxValues, setMaxValues] = useState<number[]>([])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(Date().slice(0, 24));
        }, 1000);
        return () => clearInterval(intervalId)
    }, [])

    useEffect(()=>{

       const queryCity:string|null = new URLSearchParams(window.location.search).get('location');
       axios.get(`https://api.waqi.info/feed/${queryCity}/?token=${process.env.NEXT_PUBLIC_API_KEY}`)
       .then((res)=>{
            console.log(res.data)
            updateInfo(res.data)

            const max_values: number[] = [];
            const dates: string[] = [];
            const newO3Data: PollutantData = { min: [], max: [], avg: [] };
            const newPm10Data: PollutantData = { min: [], max: [], avg: [] };
            const newPm25Data: PollutantData = { min: [], max: [], avg: [] };
            const newUviData: PollutantData = { min: [], max: [], avg: [] };


            for (const i in res.data.data.forecast?.daily.o3){
              newO3Data.min.push(res.data.data.forecast?.daily.o3[i].min);
              newO3Data.max.push(res.data.data.forecast?.daily.o3[i].max);
              newO3Data.avg.push(res.data.data.forecast?.daily.o3[i].avg);
            }

            for (const i in res.data.data.forecast?.daily.pm10){
              newPm10Data.min.push(res.data.data.forecast?.daily.pm10[i].min);
              newPm10Data.max.push(res.data.data.forecast?.daily.pm10[i].max);
              newPm10Data.avg.push(res.data.data.forecast?.daily.pm10[i].avg);
            }

            for (const i in res.data.data.forecast?.daily.pm25){
              newPm25Data.min.push(res.data.data.forecast?.daily.pm25[i].min);
              newPm25Data.max.push(res.data.data.forecast?.daily.pm25[i].max);
              newPm25Data.avg.push(res.data.data.forecast?.daily.pm25[i].avg);  
            }

            for (const i in res.data.data.forecast?.daily.uvi){
              newUviData.min.push(res.data.data.forecast?.daily.uvi[i].min);
              newUviData.max.push(res.data.data.forecast?.daily.uvi[i].max);
              newUviData.avg.push(res.data.data.forecast?.daily.uvi[i].avg);
              const [year, month, day] = res.data.data.forecast?.daily.uvi[i].day.split("-")
              dates.push(`${day}.${month}.${year}`)
            }

            max_values.push(Math.max(...newO3Data.max))
            max_values.push(Math.max(...newPm10Data.max))
            max_values.push(Math.max(...newPm25Data.max))
            max_values.push(Math.max(...newUviData.max))

            setMaxValues(max_values)
            setDates(dates)
            setO3Data(newO3Data)
            setPm10Data(newPm10Data)
            setPm25Data(newPm25Data) 
            setUviData(newUviData)
            
            if(res.data && typeof(res.data.data) != "string"){
              
              if(res.data.data.aqi <= 50){
                updateScore("Minim")
              }
              else if(res.data.data.aqi >= 51 && res.data.data.aqi <= 100){
                updateScore("Moderat")
              }
              else if(res.data.data.aqi >= 101 && res.data.data.aqi <= 150){
                updateScore("Nesănătos pentru grupurile sensibile")
              }
              else if(res.data.data.aqi >= 151 && res.data.data.aqi <= 200){
                updateScore("Nesănătos")
              }
              else if(res.data.data.aqi >= 201 && res.data.data.aqi <= 300){
                updateScore("Foarte nesănătos")
              }
              else if(res.data.data.aqi >= 301){
                updateScore("Periculos")
              }


              switch(res.data.data.idx){
                case -470920:{
                  updateName("București - Sectorul 1")
                  break
                }
                case -109186:{
                  updateName("București - Sectorul 2")
                  break
                }
                case -110290:{
                  updateName("București - Sectorul 3")
                  break
                }
                case 6845 :{
                  updateName("Râmnicu Sărat")
                  break
                }
                case -109819:{
                  updateName("București - Sectorul 4")
                  break
                }
                case 4187:{
                  updateName("Mediaș") 
                  break
                }
                case -109702:{
                  updateName("București - Sectorul 5")
                  break
                }
                case -109288:{
                  updateName("București - Sectorul 6")
                  break
                }
                case 4162:{
                  updateName("Alba Iulia")
                  break
                }
                case 4164:{
                  updateName("Arad")
                  break
                }
                case -237307:{
                  updateName("Buzău")
                  break
                }
                case 7645: {
                  updateName("Bacău");
                  break;
              }
              case 4182: {
                  updateName("Baia Mare");
                  break;
              }
              case 7658: {
                  updateName("Baloteşti");
                  break;
              }
              case 8578: {
                  updateName("Bistriţa");
                  break;
              }
              case 4168: {
                  updateName("Botoşani");
                  break;
              }
              case 7646: {
                  updateName("Braşov");
                  break;
              }
              case 6847: {
                  updateName("Călărași");
                  break;
              }
              case 4163: {
                  updateName("Câmpulung");
                  break;
              }
              case 4171: {
                  updateName("Caransebeș");
                  break;
              }
              case 8591: {
                  updateName("Cluj-Napoca");
                  break;
              }
              case 6849: {
                  updateName("Constanța");
                  break;
              }
              case 8580: {
                  updateName("Craiova");
                  break;
              }
              case 4178: {
                  updateName("Deva");
                  break;
              }
              case 6862: {
                  updateName("Drobeta-Turnu Severin");
                  break;
              }
              case 4196: {
                  updateName("Focșani");
                  break;
              }
              case 8582: {
                  updateName("Galați");
                  break;
              }
              case 6858: {
                  updateName("Giurgiu");
                  break;
              }
              case 6859: {
                  updateName("Hunedoara");
                  break;
              }
              case 4180: {
                  updateName("Iași");
                  break;
              }
              case 4173: {
                  updateName("Mangalia");
                  break;
              }
              case 4175: {
                  updateName("Medgidia");
                  break;
              }
              case 7652: {
                  updateName("Miercurea Ciuc");
                  break;
              }
              case 6837: {
                  updateName("Oradea");
                  break;
              }
              case 4193: {
                  updateName("Petroșani");
                  break;
              }
              case 4183: {
                  updateName("Piatra Neamț");
                  break;
              }
              case 7644: {
                  updateName("Pitești");
                  break;
              }
              case 6868: {
                  updateName("Ploiești");
                  break;
              }
              case 6876: {
                  updateName("Râmnicu Vâlcea");
                  break;
              }
              case 6857:{
                updateName("Tecuci")
                break
              }
              case 4170: {
                  updateName("Reșița");
                  break;
              }
              case 6873: {
                  updateName("Satu Mare");
                  break;
              }
              case 8579: {
                  updateName("Sfântu Gheorghe");
                  break;
              }
              case -502816: {
                  updateName("Sighișoara");
                  break;
              }
              case 6870: {
                  updateName("Sibiu");
                  break;
              }
              case -403114:{
                updateName("Câmpina")
                break
              }
              case 8588: {
                  updateName("Slatina");
                  break;
              }
              case 4179: {
                  updateName("Slobozia");
                  break;
              }
              case 4194: {
                  updateName("Suceava");
                  break;
              }
              case 6851: {
                  updateName("Târgovişte");
                  break;
              }
              case 8581: {
                  updateName("Târgu Jiu");
                  break;
              }
              case 6865: {
                  updateName("Târgu Mureș");
                  break;
              }
              case 7660: {
                  updateName("Timișoara");
                  break;
              }
              case 4195: {
                  updateName("Tulcea");
                  break;
              }
              case 6877: {
                  updateName("Vaslui");
                  break;
              }
              case 6872: {
                  updateName("Zalău");
                  break;
              }
                  
              }
      
             }

       })
       .catch((err)=>{
            console.log('Error fetching API data: ' + err)
       })
       .finally(()=>{
        console.log('Data obtained successfully!')
        

       })



    }, [])


    const labels = dates;

    const options_o3 = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        title: {
          display: true,
          text: 'Ozon (µg/m³)',
          font: {
            size: 30, 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 20,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 20,
            },
          },
          min: 0, 
          max: maxValues[0] + 5, 
        },
      },
      layout: {
        padding: {
          left: 130,   
          right: 130, 
          top: 130,   
          bottom: 130, 
        },
      },
    };

    const options_pm10 = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        title: {
          display: true,
          text: 'Partcule cu diametrul mai mic de 10 μm (µg/m³)',
          font: {
            size: 30, 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 20,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 20,
            },
          },
          min: 0, 
          max: maxValues[1] + 5, 
        },
      },
      layout: {
        padding: {
          left: 130,   
          right: 130, 
          top: 130,   
          bottom: 130, 
        },
      },
    };
  
    const options_pm25 = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        title: {
          display: true,
          text: 'Partcule cu diametrul mai mic de 2.5 μm (µg/m³)',
          font: {
            size: 30, 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 20,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 20,
            },
          },
          min: 0, 
          max: maxValues[2] + 5, 
        },
      },
      layout: {
        padding: {
          left: 130,   
          right: 130, 
          top: 130,   
          bottom: 130, 
        },
      },
    };

    const options_uvi = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
        },
        title: {
          display: true,
          text: 'Indice radiație ultravioletă UVI',
          font: {
            size: 30, 
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 20,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 20,
            },
          },
          min: 0, 
          max: maxValues[3] + 1, 
        },
      },
      layout: {
        padding: {
          left: 130,   
          right: 130, 
          top: 130,   
          bottom: 130, 
        },
      },
    };


    const data_o3 = {
      labels,
      datasets: [
        {
          label: 'Minim',
          data: o3Data.min,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgb(0, 0, 255)',
        },
        {
          label: 'Mediu',
          data: o3Data.avg,
          borderColor: 'rgb(230, 230, 0)',
          backgroundColor: 'rgb(230, 230, 0)',
        },
        {
          label: 'Maxim',
          data: o3Data.max,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgb(255, 0, 0)',
        },
      ],
    };

    const data_pm10 = {
      labels,
      datasets: [
        {
          label: 'Minim',
          data: pm10Data.min,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgb(0, 0, 255)',
        },
        {
          label: 'Mediu',
          data: pm10Data.avg,
          borderColor: 'rgb(230, 230, 0)',
          backgroundColor: 'rgb(230, 230, 0)',
        },
        {
          label: 'Maxim',
          data: pm10Data.max,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgb(255, 0, 0)',
        },
      ],
    };


    const data_pm25 = {
      labels,
      datasets: [
        {
          label: 'Minim',
          data: pm25Data.min,
          borderColor: 'rgb(0, 0, 255)',
          backgroundColor: 'rgb(0, 0, 255)',
        },
        {
          label: 'Mediu',
          data: pm25Data.avg,
          borderColor: 'rgb(230, 230, 0)',
          backgroundColor: 'rgb(230, 230, 0)',
        },
        {
          label: 'Maxim',
          data: pm25Data.max,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgb(255, 0, 0)',
        },
      ],
    };

    const data_uvi = {
      labels,
      datasets: [
        {
          label: 'Maxim',
          data: uviData.max,
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgb(255, 0, 0)',
        },
      ],
    };

    if(!cityInfo){
        return(
        <>
        <div className = {styles.header_bar}>
        <Image className = {styles.ro_flag} src = {ROFlag} alt="RO-flag" width={30} height={20}></Image>
        <span className = {styles.app_title}>AirToday - calitatea aerului în orașele din România</span>
        <span className = {styles.date_time}> {datetime}</span>
        </div>

        <div className={styles.page_container}>
           <h1>In asteptare....</h1>
        </div>
        
        
        </>)
    }

    else if(cityInfo.status == "error" && typeof(cityInfo.data) == "string"){

        return(
          <>

        <div className = {styles.header_bar}>
        <Image className = {styles.ro_flag} src = {ROFlag} alt="RO-flag" width={30} height={20}></Image>
        <span className = {styles.app_title}> AirToday - calitatea aerului în România zi de zi</span>
        <span className = {styles.date_time}> {datetime}</span>
        </div>

         <div className = {styles.page_container}>
            <h1>Eroare! Aceasta statie meteo nu exista!</h1>
             <Link href="/">Return</Link>
         </div>

          </>
        )

    }
    else if(typeof(cityInfo.data)!="string"){

     if(cityInfo.data.forecast){
        
     }


    return (
        <>

        <div className = {styles.header_bar}>
        <Image className = {styles.ro_flag} src = {ROFlag} alt="RO-flag" width={30} height={20}></Image>
        <span className = {styles.app_title}> AirToday - calitatea aerului în România zi de zi</span>
        <span className = {styles.date_time}> {datetime}</span>
        </div>

        <div className = {styles.page_container}>

        <h1> Calitatea aerului pentru {cityName} </h1>
        <Link href="/">Return</Link>
        <h1>Date capturate de senzorul: {cityInfo.data.idx}</h1>
        <h1>Adresa senzor: {cityInfo.data.city.name}</h1>
        <h1>Coordonate: {cityInfo.data.city.geo[0]}  {cityInfo.data.city.geo[1]}</h1>
        <h1>Data si ora inregistrarii datelor: {cityInfo.data.time['s']}</h1>
        <h1>Scor AQI: {cityInfo.data.aqi} - Nivel de poluare: {qualityScore} </h1>
        <h1>Poluant dominant: {cityInfo.data.dominentpol}</h1>
        <h1>{cityInfo.data.forecast?.daily.pm10[0].avg}</h1>
        {cityInfo.data.iaqi['dew']?.v? <h1>Temperatura punctului de rouă: {cityInfo.data.iaqi['dew']?.v} ºC</h1> : <div></div>}
        {cityInfo.data.iaqi['h']?.v? <h1>Umiditate: {cityInfo.data.iaqi['h']?.v}%</h1> : <div></div>}
        {cityInfo.data.iaqi['p']?.v? <h1>Presiune atmosferică: {cityInfo.data.iaqi['p']?.v} hPa</h1> : <div></div>}
        {cityInfo.data.iaqi['w']?.v? <h1>Viteza vântului: {cityInfo.data.iaqi['w']?.v} m/s</h1>: <div></div>}
        {cityInfo.data.iaqi['o3']?.v? <h1>Cantitate de ozon (O3): {cityInfo.data.iaqi['o3']?.v} µg/m³</h1> : <div></div>}
        {cityInfo.data.iaqi['no2']?.v? <h1>Cantitate de dioxid de azot (NO2): {cityInfo.data.iaqi['no2']?.v} µg/m³</h1> : <div></div>}
        {cityInfo.data.iaqi['pm1']?.v? <h1>Cantitate de particule PM1: {cityInfo.data.iaqi['pm1']?.v} µg/m³</h1> : <div></div>}
        {cityInfo.data.iaqi['pm10']?.v? <h1>Cantitate de particule PM10: {cityInfo.data.iaqi['pm10']?.v} µg/m³</h1> : <div></div>}  
        {cityInfo.data.iaqi['pm25']?.v? <h1>Cantitate de particule PM25: {cityInfo.data.iaqi['pm25']?.v} µg/m³</h1> : <div></div>}  
        {cityInfo.data.iaqi['t']?.v? <h1>Temperatură: {cityInfo.data.iaqi['t']?.v} ºC</h1> : <div></div>}

        </div>
        
        <hr></hr>

        {cityInfo.data.forecast? 
        <> 

              <h1 className = {styles.centered_text}> Date forecast</h1>

              <Line options={options_o3} data={data_o3} />

              <Line options={options_pm25} data={data_pm25} />

              <Line options={options_pm10} data={data_pm10} />

              <Line options={options_uvi} data = {data_uvi} />

  

        </>

        :   //ELSE
        
        
        <div>Această stație nu este prevăzută cu funcția de forecast.</div>}



        </>
        

    ); }


}   