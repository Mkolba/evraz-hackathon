# -*- coding: utf-8 -*-

from traceback import format_exc
from utils import BetterDict
from aiohttp import web
from uuid import uuid4
import asyncio
import json


class Socket:
    def __init__(self, sock, id):
        self.sock = sock
        self.id = id

    async def send(self, event_type, **kwargs):
        kwargs.update({'type': event_type})
        await self.sock.send_json(kwargs)


class WSHandler(web.View):
    async def get(self):
        sock = web.WebSocketResponse(heartbeat=1.0)
        await sock.prepare(self.request)
        app = self.request.app
        socket = Socket(sock, uuid4())
        app.sockets.update({socket.id: socket})
        if app.last_event:
            await socket.send('update', data=app.last_event, ts=app.last_event_ts)

        try:
            async for event in sock:
                try:
                    pass
                except:
                    await socket.send('error', code=500)
                    print(format_exc())

        except Exception as err:
            print(format_exc())

        finally:
            app.sockets.pop(socket.id)
            await sock.close()

        return sock

    async def broadcast(self, event_type, except_id=None, **kwargs):
        for id, client in self.request.app.sockets.items():
            if id != except_id and client and not client.sock.closed:
                await client.send(event_type, **kwargs)
