from lifxlan import *
from aiocron import *
import asyncio
import yaml
import json
import math

# yaml file with configuration.
CONFIG_FILE = 'config.yaml'

# default transition time when powering on/off or changing colors.
DEFAULT_TRANSITION = 5

HUE = 'hue'
SATURATION = 'saturation'
TRANSITION = 'transition'
BRIGHTNESS = 'brightness'
TEMPERATURE = 'temperature'
POWER = 'power'
NAME = 'name'


def sec_to_ms(seconds):
    return seconds * 1000

def ms_to_sec(ms):
    return ms / 1000


def log(line):
    print(time.strftime('%H:%M:%S') + ' > ' + line)


class CircadianLifx:
    """ wowza """

    def __init__(self):
        log('Discovering lamps..')
        self.lifx = LifxLAN()

        lights = self.lifx.get_lights()
        lights = ','.join(map(lambda light: "'{}'".format(light.get_label()), lights))
        log("Discovered {}".format(lights))

        self.configure()


    async def on(self, lamp, schema):
        transition = self.get_transition(schema)
        log("powering up {} over {}s".format(schema[NAME], ms_to_sec(transition)))
        lamp.set_power(True, transition)
        await asyncio.sleep(ms_to_sec(transition))


    def get_transition(self, schema):
        return sec_to_ms(schema.get(TRANSITION, DEFAULT_TRANSITION))


    async def off(self, lamp, schema):
        transition = self.get_transition(schema)
        log("powering down {} over {}s.".format(schema[NAME], ms_to_sec(transition)))
        lamp.set_power(False, transition)
        await asyncio.sleep(ms_to_sec(transition))


    def configure(self):
        log("loading configuration from '{}'..".format(CONFIG_FILE))
        with open(CONFIG_FILE, 'r') as file:
            config = yaml.safe_load(file)
            self.configure_alarms(config)
            log('Configuration completed.')


    def set_color(self, lamp, schema):
        current = lamp.get_color()
     
        hue = current[0]
        saturation = current[1]
        brightness = current[2]
        temperature = current[3]
        transition = self.get_transition(schema)

        if (HUE in schema):
            hue = schema[HUE] * 182

        if (SATURATION in schema):
            saturation = math.trunc(schema[SATURATION] * 256 * 256 -1)


        if (BRIGHTNESS in schema):
            brightness = math.trunc(schema[BRIGHTNESS] * 256 * 256 -1)

        if (TEMPERATURE in schema):
            temperature = schema[TEMPERATURE]

        log("set color of lamp '{}' to [{}, {}, {}, {}] over transition {}s"
                .format(schema[NAME], hue, saturation, brightness, temperature, ms_to_sec(transition)))

        lamp.set_color([hue, saturation, brightness, temperature], transition)


    async def process_event(self, lamp, schema):
        keys = [HUE, SATURATION, BRIGHTNESS, TEMPERATURE]

        log("processing event: {}".format(json.dumps(schema)))

        color_updated = False
        for key in keys:
            if key in schema:
                color_updated = True

        update_color = lambda: self.set_color(lamp, schema) if color_updated else None

        if (POWER in schema):
            if (schema[POWER]):     
                update_color()
                await self.on(lamp, schema)
            else:
                await self.off(lamp, schema)
                update_color()


    def configure_alarms(self, config):
        log('scheduling lamps..')
        for lamp in config['lamps']:
            schemas = lamp['schema']

            log("configuring lamp '{}'..".format(lamp['name']))
            lamp = self.lifx.get_device_by_name(lamp['name'])

            for schema in schemas:
                schema['name'] = lamp.get_label()
                cron = schema['cron']
                power = schema['power']
                print("\t\t- scheduled at '{}', power={}".format(cron, power))
                crontab(cron, func=lambda: self.process_event(lamp, schema), start=True)

                # dev
                if (schema['name'] == 'LIFX Flory'):
                    crontab("* * * * * 0,15,30,45", func=lambda: self.process_event(lamp, schema), start=True)


try:
    loop = asyncio.get_event_loop()
    CircadianLifx()
    loop.run_forever()
except KeyboardInterrupt:
    log('timer was stopped by user.')
    pass

