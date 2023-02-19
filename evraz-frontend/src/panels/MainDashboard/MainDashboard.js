import { Temperature, AccessPoint, Droplet } from 'tabler-icons-react';
import AgloGrid from "../../components/AgloGrid/AgloGrid";
import './MainDashboard.scss'

export default function MainDashboard({data, goToExhauster, lastUpdate}) {

    return (
        <div className={'MainDashboard'}>
            <div className={'MainLegend'}>
                <div className={'MainLegendContainer'}>
                    <div className={'MainLegendItem'}>
                        {
                            lastUpdate ?
                                <div>Обновлено {lastUpdate && lastUpdate.toLocaleString()}</div>
                            : null
                        }
                    </div>
                </div>
                <div className={'MainLegendContainer'}>
                    <div className={'MainLegendItem'}>
                        <div className={'MainLegendIcon'}>
                            <span>T</span> <Temperature size={18}/>
                        </div>
                        Температура
                    </div>
                    <div className={'MainLegendItem'}>
                        <div className={'MainLegendIcon'}>
                            <span style={{paddingRight: 2}}>V</span> <AccessPoint size={18}/>
                        </div>
                        Вибрация
                    </div>
                    <div className={'MainLegendItem'}>
                        <div className={'MainLegendIcon'}>
                            <span>L</span> <Droplet size={18}/>
                        </div>
                        Уровень масла
                    </div>
                    <div className={'MainLegendItem'}>
                        <div className={'MainLegendColor warning'}/> Предупреждение
                    </div>
                    <div className={'MainLegendItem'}>
                        <div className={'MainLegendColor error'}/> Опасность
                    </div>
                </div>
            </div>
            <AgloGrid data={data} goToExhauster={goToExhauster}/>
        </div>
    )
}