# -*- coding: utf-8 -*-

from aiokafka import AIOKafkaConsumer
import ssl

from api import WSHandler
from aiohttp import web, ClientSession
from utils.logger import Logger
from utils import convert_from_kafka
import asyncio
import config
import json


logger = Logger("SERVER")


async def consume(app):
    ctx = ssl.create_default_context(cafile='./CA.pem')
    consumer = AIOKafkaConsumer(
        'zsmk-9433-dev-01',
        bootstrap_servers='rc1a-2ar1hqnl386tvq7k.mdb.yandexcloud.net:9091',
        group_id="shershaviy-okun",
        ssl_context=ctx,
        sasl_plain_username='9433_reader',
        sasl_mechanism='SCRAM-SHA-512',
        sasl_plain_password='eUIpgWu0PWTJaTrjhjQD3.hoyhntiK',
        security_protocol='SASL_SSL',
        auto_offset_reset='latest'
    )

    await consumer.start()
    try:
        async for msg in consumer:
            print("consumed: ", msg.value)
            data = json.loads(msg.value)

            app.last_event_ts = data['moment']
            app.last_event = convert_from_kafka(data)

            for socket in app.sockets.values():
                await socket.send('update', data=app.last_event, ts=app.last_event_ts)
    finally:
        await consumer.stop()


async def create_app(loop):
    app = web.Application()
    app.session = ClientSession()
    app.event_loop = loop
    app.sockets = {}
    app.last_event = None
    app.last_event_ts = None

    loop.create_task(consume(app))

    app.router.add_route(method='GET', path='/ws', handler=WSHandler)

    # Starting server
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, port=config.port, host=config.host)
    return app, site


if __name__ == '__main__':

    loop = asyncio.get_event_loop()
    app, site = loop.run_until_complete(create_app(loop))
    loop.create_task(site.start())

    try:
        logger.ok('Сервер запущен')
        loop.run_forever()
    except KeyboardInterrupt:
        logger.critical('Сервер принудительно остановлен')
