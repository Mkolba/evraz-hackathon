import {useEffect} from "react";
import { Grid, Accordion } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import { ReactComponent as Scheme} from "./../../img/Scheme.svg";
import BearingInfo from "../BearingInfo/BearingInfo";
import './ExhausterGrid.scss'


function ExhausterContainer({title, status, rotorNum, bearings, index, renewed, goToExhauster, work}) {
    let new_bearings = [];
    let warnings = [];
    let defaults = [];
    let new_title = title.replace(`№ ${index} (`, '');
    new_title = new_title.replace(')', '')

    let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    let dt = new Date(renewed.replace(pattern,'$3-$2-$1'));
    let uptime = ((new Date()).getTime() - dt.getTime()) / (1000 * 3600 * 24);

    bearings.forEach((item, i) => {
        let icons = [];
        icons.push({type: 'temp', status: item[0].status});
        if (item.length > 1) {
            let status = 'default';
            for (let index = 1; index < item.length; index++) {
                if (item[index]['status'] !== status) {
                    status = item[index]['status'];
                    break;
                }
            }
            icons.push({type: 'vibration', status: status})
        }
        new_bearings.push({title: `П-к №${i + 1}`, icons: icons})
    })

    new_bearings.forEach((item, i) => {
        item.num = i + 1;
        let is_warning = false;
        for (let icon of item.icons) {
            if (['warning', 'error'].includes(icon.status)) {
                warnings.push(item);
                is_warning = true;
                break;
            }
        }
        if (!is_warning) {
            defaults.push(item);
        }
    })

    let onBearingHover = (num) => {
        if (num < 10) {
            let elms = document.querySelectorAll("#Bearing-" + num);
            elms[index - 1].style.fill = 'yellow';
        }
    }

    let onBearingHoverLeave = (num) => {
        console.log(index)
        if (num < 10) {
            let elms = document.querySelectorAll("#Bearing-" + num);
            elms[index - 1].style = null;
        }
    }

    return (
        <div className={'ExhausterContainer'}>
            <div className={'ExhausterHeader'}>
                <div className={'Container'}>
                    <div className={'StatusIndicator' + (!work['work'] ? ' offline' : '')}/>
                    <div className={'Text'}>{new_title}</div>
                </div>
                <div className={'Button'} onClick={() => goToExhauster(title)}>
                    <ChevronRight size={16} color={'#B1B1B2'}/>
                </div>
            </div>
            <div className={'Rotor'}>
                <div className={'RotorData'}>
                    <div className={'RotorTitle'}>
                        Ротор № {rotorNum}
                    </div>
                    <div className={'RotorDate'}>
                        {renewed}
                    </div>
                </div>
                <div className={'RotorStatus'}>
                    <div className={'RotorStatusHeader'}>
                        Последняя замена ротора
                    </div>
                    <div className={'RotorStatusContainer'}>
                        <div className={'RotorUptime'}>
                            {Math.floor(uptime)} сут
                        </div>
                        <div className={'RotorPrediction'}>
                            <div className={'RotorPredictionHeader'}>
                                Прогноз
                            </div>
                            0 сут
                        </div>
                    </div>
                </div>
                <div className={'RotorImage'}>
                    <Scheme/>
                </div>
                <div className={'RotorBearings'}>
                    <div className={'RotorBearingsInfo'}>
                        <Accordion multiple={true} variant="filled" defaultValue={['warnings']} className={'BearingsAccordion'} chevronPosition="left">
                            {warnings.length ?
                                <Accordion.Item value="warnings">
                                    <Accordion.Control className={'Control'}>Предупреждения</Accordion.Control>
                                    <Accordion.Panel>
                                        {warnings.map(item => (
                                            <BearingInfo num={item.num} title={item.title} icons={item.icons} onMouseEnter={onBearingHover} onMouseLeave={onBearingHoverLeave}/>
                                        ))}
                                    </Accordion.Panel>
                                </Accordion.Item>
                                :null
                            }
                            {defaults.length ?
                                <Accordion.Item value="status">
                                    <Accordion.Control className={'Control'}>Все подшипники</Accordion.Control>
                                    <Accordion.Panel>
                                        {defaults.map(item => (
                                            <BearingInfo num={item.num} title={item.title} icons={item.icons} onMouseEnter={onBearingHover} onMouseLeave={onBearingHoverLeave}/>
                                        ))}
                                    </Accordion.Panel>
                                </Accordion.Item>
                                : null
                            }
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ExhausterGrid({data, num, goToExhauster}) {
    return (
        <Grid align="flex-start" className={'ExhausterGrid'}>
            {data.map((item, index) => (
                <Grid.Col span={6}>
                    <ExhausterContainer index={2 * num - (1 - index)} {...item} goToExhauster={goToExhauster}/>
                </Grid.Col>
            ))}
        </Grid>
    )
}