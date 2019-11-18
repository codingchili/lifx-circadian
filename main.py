from lifxlan import *
from aiocron import *
import asyncio
import yaml

# yaml file with configuration.
CONFIG_FILE = 'config.yaml'

# the color used when fading to nighttime.
COLOR_NIGHT = [0x0, 0x0, 0x0, 2500]
    

def sec_to_ms(seconds):
    return seconds * 1000


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

        self.fade_day = 900
        self.fade_night = 300
        self.color_default = [0xCBCB, 0xFFFF, 0xAFFF, 2500]
        
        self.configure()


    async def on(self, lamp):
        log("powering up {} over {}s".format(lamp.get_label(), self.fade_day))
        lamp.set_power(True)
        #color = lamp.get_color()
        #if (color[0] == 0x0):
        #    color = self.color_default
        color = self.color_default
        lamp.set_color(color, sec_to_ms(self.fade_day))


    async def off(self, lamp):
        log("powering down {} over {}s.".format(lamp.get_label(), self.fade_night))
        lamp.set_color(COLOR_NIGHT, sec_to_ms(self.fade_night))
        await asyncio.sleep(self.fade_night)
        lamp.set_power(False)

    def configure(self):
        log("loading configuration from '{}'..".format(CONFIG_FILE))
        with open(CONFIG_FILE, 'r') as file:
            config = yaml.safe_load(file)

            self.configure_schedule(config)
            self.configure_fade(config)
            self.configure_color(config)
            log('Configuration completed.')


    def configure_schedule(self, config):
        log('scheduling lamps..')
        for lamp in config['lamps']:
            schemas = lamp['schema']

            log("configuring lamp '{}'..".format(lamp['name']))
            lamp = self.lifx.get_device_by_name(lamp['name'])

            for schema in schemas:
                cron = schema['cron']
                power = schema['power']
                print("\t\t- scheduled at '{}', power={}".format(cron, power))

                if (power):
                    crontab(cron, func=lambda: self.on(lamp), start=True)
                else:
                    crontab(cron, func=lambda: self.off(lamp), start=True)


    def configure_fade(self, config):
        fade = config['fade']
        self.fade_day = fade['day']
        self.fade_night = fade['night']
        log('configuring fade timers')
        print("\t\t- night->day set to {}s.".format(self.fade_day))
        print("\t\t- day->night set to {}s.".format(self.fade_night))


    def configure_color(self, config):
        configured_color = config['default_color']
        if (configured_color is not None):
            self.color_default = config['default_color']
            log("default color configured {}".format(self.color_default))
        else:
            log("default color not configured using {}".format(self.color_default))            


try:
    loop = asyncio.get_event_loop()
    CircadianLifx()
    loop.run_forever()
except KeyboardInterrupt:
    log('timer was stopped by user.')
    pass

