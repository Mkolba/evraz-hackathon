import { Header, Container, Anchor, Breadcrumbs } from '@mantine/core';
import Logo from "../Logo/logo";
import './Header.scss'

export default function MainHeader({anchors}) {
    let items = anchors.map((item, index) => (
        <Anchor onClick={item.onClick ? item.onClick : () => {}} key={index} className={'Anchor'}>
            {item.title}
        </Anchor>
    ));
    return (
        <Header height={60} mb={10} className={'MainHeader'}>
            <Container height={60} className={'Container'}>
                <Logo/>
                <Breadcrumbs className={'Breadcrumbs'}>
                    {items}
                </Breadcrumbs>
            </Container>
        </Header>
    );
}