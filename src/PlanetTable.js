import { useEffect, useState } from 'react';

function PlanetTable(props) {
    function makeRows(planetsAtATime) {
        let start = (props.page-1)*10
        let planetarySlice = props.planetaryData.slice(start, start+planetsAtATime);
        return planetarySlice.map((planet) => {
            return (
                <tr>
                    {props.attributes.map((property) => <td>{planet[property]}</td>)}
                </tr>
            )
        })
    }
    function updateTitle(e) {
        props.changeChartTitle(e.target.textContent);
    }
    return (
        <div className="Table">
          <span className="Table-title">Planet Attributes</span>
          <div className="Table-instructions">Click a column header to chart that column!
          (Yes, I know climate and name don't make sense)
          </div>
          <table className="Attributes-table">
            <tr>
              {props.attributes.map((item) => <th onClick={(e)=>{
                                                    props.changeChart(item);
                                                    updateTitle(e);
                                                }}>
                  {item.split("_")
                       .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                       .join(" ")}
                </th>)}
            </tr>
            {makeRows(10)}
          </table>
          <div className="Scroll">
              <button onClick={()=>props.changePage(props.page-1)} 
                      disabled={props.page===1}>
                          Previous 10 planets
              </button>
              <button onClick={()=>props.changePage(props.page+1)}
                      disabled={props.page===Math.ceil(props.planetaryData.length/10)}>
                          Next 10 planets
              </button>
          </div>
        </div>
    )
}

export default PlanetTable;