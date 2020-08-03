import asyncio
import aiohttp
import json
import math

from server import lamps
from server import configuration
from server.log import log

class LeagueApi:
	""" League of Legends active game API. """
	url = 'https://127.0.0.1:2999/liveclientdata/activeplayer'
	loop = None

	def __init__(self, loop):
		self.health = 100
		self.loop = loop

	async def health_percent(self):
		""" called to retrieve data from the API """
		async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(verify_ssl=False)) as session:
			return await self.get(session)

	async def get(self, session):
		async with session.get(self.url) as resp:
			stats = json.loads(await resp.text())['championStats']
			health = math.ceil((stats['currentHealth'] * 100 / stats['maxHealth']))
			return health

def color(health):
    schema = configuration.SchemaConfiguration()

    # cheapest gradient.
    red = (255 - math.ceil(health * 2.55))
    green = math.ceil(health * 2.55)

    color = f'#{red:02x}{green:02x}00'
    schema.set_hue(color)

    schema.set_brightness(1.0)
    schema.set_saturation(1.0)
    return schema


async def run(loop, lamp):
    lifx = lamps.CircadianLifx()
    league = LeagueApi(loop)

    lamp = lifx.get_device_by_name(lamp)

    while True:
        try:
            health = await league.health_percent()
            lifx.set_color(lamp, color(health))
            await asyncio.sleep(0.5)
        except:
            log("no active game - sleeping for 5 seconds.")
            await asyncio.sleep(5)
            # restore original state.

