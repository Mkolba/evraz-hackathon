import { SimpleGrid } from '@mantine/core';
import ExhausterGrid from "../ExhausterGrid/ExhausterGrid";
import './AgloGrid.scss'

function AgloContainer({children, title}) {
    return (
        <div className={'AgloContainer'}>
            <div className={'AgloHeader'}>
                {title}
            </div>
            {children}
        </div>
    )
}

export default function AgloGrid({data, goToExhauster}) {
    console.log(data);
    return (
        <SimpleGrid cols={3} className={'AgloGrid'}>
            {data.map((item, num) => (
                <AgloContainer title={item.title}>
                    <ExhausterGrid data={item.exhausters} num={num + 1} goToExhauster={goToExhauster}/>
                </AgloContainer>
            ))}
        </SimpleGrid>
    )
}