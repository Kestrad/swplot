import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [hasData, setHasData] = useState(false);
  const [planetaryData, setPlanetaryData] = useState([]);
  useEffect(() => {
    let data = [];
    function grabPlanets(url) {
      return fetch(url)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          data.push(...res.results);
          if (res.next) {
            return grabPlanets(res.next);
          }
        })
    }
    grabPlanets(`https://swapi.dev/api/planets`)
      .then(() => {
        data = data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
        setPlanetaryData(data);
        setHasData(true);
      });
  }, []);

  const [planetsPage, setPlanetsPage] = useState(1);
  
  function getPlanetNames(page, size=10) {
    let startIndex = (page-1)*10;
    let names = [];
    for (let i=startIndex; i<startIndex+size; i++) {
      names.push(planetaryData[i].name);
    }
    return names;
  }

  function getPlanetPops(page, size=10) {
    let startIndex = (page-1)*10;
    let pops = [];
    for (let i=startIndex; i<startIndex+size; i++) {
      pops.push(planetaryData[i].population);
    }
    return pops;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Planetary Charts</h1>
      </header>
      <div className="Charts">
        {hasData ? <Plot
          data={
            [{type: 'bar', x: getPlanetNames(planetsPage), y: getPlanetPops(planetsPage)},]
          }
          layout={{title: "Planet Populations"}}
          /> : "Loading..."}
      </div>
    </div>
  );
}

export default App;
