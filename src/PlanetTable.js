import { useEffect, useState } from 'react';

function PlanetTable(props) {
    return (
        <div className="Table">
          <span className="Table-title">Planet Attributes</span>
          <table className="Attributes-table">
            <tr>
              {props.attributes.map((item) => <th>{item.split("_")
                                                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                                                .join(" ")}</th>)}
            </tr>
            {props.planetaryData.map((planet) => {
              return (
                <tr>
                  {props.attributes.map((property) => <td>{planet[property]}</td>)}
                </tr>
              )
            })}
          </table>
        </div>
    )
}

export default PlanetTable;