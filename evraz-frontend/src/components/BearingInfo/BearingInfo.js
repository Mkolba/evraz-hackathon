import { Temperature, AccessPoint, Droplet } from 'tabler-icons-react';
import './BearingInfo.scss';

function Icon(type, status='default') {
    if (type === 'temp') {
        return (
            <div className={'BearingIcon ' + status}>
                <span>T</span> <Temperature size={18}/>
            </div>
        );
    }
    if (type === 'vibration') {
        return (
            <div className={'BearingIcon ' + status}>
                <span style={{paddingRight: 2}}>V</span> <AccessPoint size={18}/>
            </div>
        );
    }
    if (type === 'oil') {
        return (
            <div className={'BearingIcon ' + status}>
                <span>L</span> <Droplet size={18}/>
            </div>
        );
    }
}

function GetIcons(icons) {
    return (
        <div className={'BearingIcons'}>
            { icons.map(item => Icon(item.type, item.status)) }
        </div>
    )
}

export default function BearingInfo({title, icons, num, onMouseEnter, onMouseLeave}) {
    return (
        <div className={'BearingInfo'} onMouseEnter={() => onMouseEnter(num)} onMouseLeave={() => onMouseLeave(num)}>
            <div className={'BearingTitle'}>
                {title}
            </div>
            {(icons && icons.length) && GetIcons(icons)}
        </div>
    )
}