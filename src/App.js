import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

function App() {
  const [dataState, setDataState] = useState(null);
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
        setDataState(true);
      })
      .catch(() => {
        setDataState("error");
      })
  }, []);

  const [planetsPage, setPlanetsPage] = useState(1);
  
  function getPlanetAttributes(attr, page=1, size=planetaryData.length) {
    let startIndex = (page-1)*10;
    let attrs = [];
    for (let i=startIndex; i<startIndex+size; i++) {
      attrs.push(planetaryData[i][attr]);
    }
    return attrs;
  }

  function renderCharts() {
    return (
      <Plot
          data={
            [{type: 'bar', x: getPlanetAttributes("name"), y: getPlanetAttributes("population")},]
          }
          layout={{title: "Planet Populations"}}
          className="Population-chart"
      />
    )
  }

  function renderStatus() {
    if (dataState === null) {
      return (
        <span className="Loading-message">Loading...</span>
      )
    }
    return <span className="Loading-message">Something went wrong, please try refreshing!</span>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Planetary Charts</h1>
      </header>
      <div className="Charts">
        {dataState===true ? renderCharts() : renderStatus()}
      </div>
    </div>
  );
}

export default App;
