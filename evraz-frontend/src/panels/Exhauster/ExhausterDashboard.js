import { } from 'tabler-icons-react';
import {ReactComponent as AgloMashine} from "../../img/Content.svg";
import {useEffect, useState} from "react";
import './ExhausterDashboard.scss'

function getSensorItem(sensor) {
    let type = Object.keys(sensor)[0];
    if (type === 'temperature') {
        return (
            <div className={'BearingContentItem ' + sensor.status}>
                <div className={'ItemText'}>T, °С</div>
                <div className={'ItemValue'}>{Math.round(sensor[type] * 100) / 100}</div>
            </div>
        )
    }
    if (type === 'vibration_axial') {
        return (
            <div className={'BearingContentItem ' + sensor.status}>
                <div className={'ItemText'}>В, мм/с</div>
                <div className={'ItemValue'}>{Math.round(sensor[type] * 100) / 100}</div>
            </div>
        )
    }
    if (type === 'vibration_horizontal') {
        return (
            <div className={'BearingContentItem ' + sensor.status}>
                <div className={'ItemText'}>Г, мм/с</div>
                <div className={'ItemValue'}>{Math.round(sensor[type] * 100) / 100}</div>
            </div>
        )
    }
    if (type === 'vibration_vertical') {
        return (
            <div className={'BearingContentItem ' + sensor.status}>
                <div className={'ItemText'}>О, мм/с</div>
                <div className={'ItemValue'}>{Math.round(sensor[type] * 100) / 100}</div>
            </div>
        )
    }
}

export default function ExhausterDashboard({data, selectedAglo, selectedExhauster, lastUpdate}) {
    let [elements, setElements] = useState([]);
    data = data[selectedAglo]['exhausters'][selectedExhauster];

    useEffect(() => {
        let el, rect, status;
        let els = []

        Object.entries(data).forEach(([key, value]) => {
          if (key === 'bearings') {
              data[key].forEach((item, index) => {
                  el = document.getElementsByClassName('BearingContent-' + (index + 1))[0];
                  rect = el.getBoundingClientRect();

                  let is_warning = item.filter(x => x.status === 'warning').length > 0;
                  let is_error = item.filter(x => x.status === 'error').length > 0;
                  let bearing = document.getElementsByClassName('Bearing-' + (index + 1));

                  if (is_error) {
                      bearing[0].style.fill = '#FCDBCB';
                      bearing[1].style.stroke = '#EB5835';
                  } else if (is_warning) {
                      bearing[0].style.fill = '#FEF1DB';
                      bearing[1].style.stroke = '#F69112';
                  } else {
                      bearing[0].style.fill = '#F4F4F4';
                      bearing[1].style.stroke = '#414F4F';
                  }

                  els.push(
                      <div className={'BearingContent'} style={{top: rect.top + 30, left: rect.left + 8, width: rect.right - rect.left - 16}}>
                          {item.map((sensor, i) => getSensorItem(sensor))}
                      </div>
                  )
              })
          } else if (key === 'water') {
              el = document.getElementsByClassName('WaterTempBefore')[0];
              rect = el.getBoundingClientRect();
              status = value.temperature_before < 30 ? 'default' : 'warning';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else {
                  el.style.fill = '#414F4F'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top + 3, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.temperature_before)} <span>°С</span>
                  </div>
              )

              el = document.getElementsByClassName('WaterTempAfter')[0];
              rect = el.getBoundingClientRect();
              status = value.temperature_after < 30 ? 'default' : 'warning';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else {
                  el.style.fill = '#414F4F'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top + 3, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.temperature_after)} <span>°С</span>
                  </div>
              )
          } else if (key === 'gas') {
              el = document.getElementsByClassName('GasTemp')[0];
              rect = el.getBoundingClientRect();
              els.push(
                  <div className={'GasTempData'} style={{top: rect.top, left: rect.left + 4, width: rect.right - rect.left}}>
                      {Math.round(value.temperature_before)}
                      <div className={'Text'}>Температура газа °С</div>
                  </div>
              )

              el = document.getElementsByClassName('GasDischarge')[0];
              rect = el.getBoundingClientRect();
              els.push(
                  <div className={'GasDischargeData'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.underpressure_before)}
                  </div>
              )

              el = document.getElementsByClassName('GasDust')[0];
              rect = el.getBoundingClientRect();
              els.push(
                  <div className={'GasDischargeData'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      —
                  </div>
              )
          } else if (key === 'oil') {
              el = document.getElementsByClassName('OilTempBefore')[0];
              rect = el.getBoundingClientRect();
              status = value.temperature_before < 30 ? 'default' : 'warning';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else {
                  el.style.fill = '#414F4F'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top + 3, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.temperature_before)} <span>°С</span>
                  </div>
              )

              el = document.getElementsByClassName('OilTempAfter')[0];
              rect = el.getBoundingClientRect();
              status = value.temperature_after < 30 ? 'default' : 'warning';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else {
                  el.style.fill = '#414F4F'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top + 3, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.temperature_after)} <span>°С</span>
                  </div>
              )

              el = document.getElementsByClassName('OilLevel')[0];
              rect = el.getBoundingClientRect();
              let background = value.oil_level >= 20 ? '#4ADB62' : value.oil_level >= 10 ? '#FAB82E' : '#F18863';
              els.push(
                  <div className={'OilLevelData'} style={{top: rect.top + 12, left: rect.left + 4, width: rect.right - rect.left - 8}}>
                      <div className={'OilLevelIndicator'} style={{width: `${Math.round(value.oil_level)}%`, backgroundColor: background}}/>
                      <div className={'Value'}>{Math.round(value.oil_level)}</div>
                      <div className={'Text'}>Уровень масла, %</div>
                  </div>
              )

              el = document.getElementsByClassName('OilPressure')[0];
              rect = el.getBoundingClientRect();
              background = Math.round(value.oil_pressure * 100) / 100 >= 0.5 ? '#4ADB62' : '#F18863';
              els.push(
                  <div className={'OilPressureData'} style={{top: rect.top + 12, left: rect.left + 4, width: rect.right - rect.left - 8}}>
                      <div className={'OilPressureIndicator'} style={{width: `${(Math.round(value.oil_pressure * 100) / 6)}%`, backgroundColor: background}}/>
                      <div className={'Value'}>{Math.round(value.oil_pressure * 100) / 100}</div>
                      <div className={'Text'}>Давление масла, <span>кг/см<sup>2</sup></span></div>
                  </div>
              )
          } else if (key === 'rotor') {
              el = document.getElementsByClassName('StatorAmperage')[0];
              rect = el.getBoundingClientRect();
              status = value.stator_current >= 280 ? 'error' : value.stator_current >= 230 ? 'warning' : 'default';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else if (status === 'default') {
                  el.style.fill = '#414F4F'
              } else {
                  el.style.fill = '#EB5835'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.stator_current)}
                  </div>
              )

              el = document.getElementsByClassName('RotorAmperage')[0];
              rect = el.getBoundingClientRect();
              status = value.rotor_current < 200 ? 'default' : 'warning';
              if (status === "warning") {
                  el.style.fill = '#FAB82E';
              } else {
                  el.style.fill = '#414F4F'
              }
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.rotor_current)}
                  </div>
              )
              el = document.getElementsByClassName('StatorVoltage')[0];
              rect = el.getBoundingClientRect();

              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.stator_voltage)}
                  </div>
              )

              el = document.getElementsByClassName('RotorVoltage')[0];
              rect = el.getBoundingClientRect();
              els.push(
                  <div className={'WaterTemp'} style={{top: rect.top, left: rect.left, width: rect.right - rect.left}}>
                      {Math.round(value.rotor_voltage)}
                  </div>
              )
          } else if (key === 'valve') {
              el = document.getElementsByClassName('Valve')[0];
              rect = el.getBoundingClientRect();
              let offset = (76 / 100 * Math.round(value.gas_valve_position));
              el.setAttribute('transform', `translate(${-(76 - offset)}, 0)`)
              els.push(
                  <div className={'ValveIndicator'} style={{top: rect.top, left: rect.left + 70 - offset, width: rect.right - rect.left}}>
                      {Math.round(value.gas_valve_position)}%
                  </div>
              )

          }

        })

        els.push(
            <div className={"ExhausterDashboardLastUpdate"}>
                {
                    lastUpdate ?
                        <div>Обновлено {lastUpdate && lastUpdate.toLocaleString()}</div>
                        : null
                }
            </div>
        )

        setElements(els);
    });

    return (
        <div className={'ExhausterDashboard'}>
            <AgloMashine/>
            {elements}
        </div>
    )
}