import {AppShell, MantineProvider} from '@mantine/core';

import {useEffect, useState} from 'react';


import MainHeader from "./components/Header/Header";
import MainDashboard from "./panels/MainDashboard/MainDashboard";
import ExhausterDashboard from "./panels/Exhauster/ExhausterDashboard";

export default function App() {
    let [activePanel, setActivePanel] = useState('mainDashboard');
    let [selectedAglo, selectAglo] = useState(null);
    let [selectedExhauster, selectExhauster] = useState(null);
    let [anchors, setAnchors] = useState([{ title: 'Прогнозная аналитика эксгаустера', href: '#' }])
    let [aglomachines, setAglomachines] = useState([])
    let [lastUpdate, setLastUpdate] = useState(null);

    let [socket, setSocket] = useState(null);

    let toggleAnchors = (state, selectedAglo_, selectedExhauster_) => {

        if (state) {
            setAnchors([
                { title: 'Прогнозная аналитика эксгаустера', onClick: goHome },
                { title: 'Состояние эксгаустера ' + (aglomachines[selectedAglo_]['exhausters'][selectedExhauster_]['title'].split(' ')[3]), href: '#' }
            ])
        } else {
            setAnchors([{ title: 'Прогнозная аналитика эксгаустера', href: '#' }])
        }
    }

    let goHome = () => {
        selectExhauster(null);
        selectAglo(null);
        toggleAnchors(false);
        setActivePanel('mainDashboard');
    }

    let goToExhauster = (name) => {
        aglomachines.forEach((item, agloNum) => {
            item.exhausters.forEach((exhauster, num) => {
                if (exhauster.title === name) {
                    selectExhauster(num);
                    selectAglo(agloNum);
                    toggleAnchors(true, agloNum, num);
                    setActivePanel('exhausterDashboard');
                }
            })
        })
    }

    let connectToWS = () => {
        let socket = new WebSocket("wss://websocket.adawhite.ru/wss");

        socket.onmessage = (event) => {
            event = JSON.parse(event.data);
            if (event.type === 'update') {
                let date = new Date(event.ts + 'Z')
                setLastUpdate(date);
                setAglomachines(event.data);
            }
        }
    }

    useEffect(() => {
        connectToWS();
    }, [])

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{
            fontFamily: 'Montserrat, sans-serif',
            fontFamilyMonospace: 'Montserrat, sans-serif',
            headings: { fontFamily: 'Montserrat, sans-serif' }
        }}>
            <AppShell header={<MainHeader anchors={anchors}/>}>
                {
                    activePanel === 'mainDashboard' ?
                        <MainDashboard data={aglomachines} goToExhauster={goToExhauster} lastUpdate={lastUpdate}/>
                    : activePanel === 'exhausterDashboard' ?
                        <ExhausterDashboard data={aglomachines} selectedAglo={selectedAglo} selectedExhauster={selectedExhauster} lastUpdate={lastUpdate}/>
                    : null
                }
            </AppShell>

        </MantineProvider>
    );
}