from lifxlan import *
from aiocron import *
from server.configuration import *
import asyncio


class CircadianLifx:
    """ controls and schedules state updates to lifx lamps. """

    def __init__(self):
        log('discovering lamps..')
        self.lifx = LifxLAN()
        self.jobs = []
        self.lights = self.lifx.get_lights()

        labels = ','.join(map(lambda light: "'{}'".format(light.get_label()), self.lights))
        log("discovered {}".format(labels))

    def get_lights(self):
        return self.lights

    async def on(self, lamp, schema):
        transition = schema.get_transition()
        log("powering up {} over {}s".format(schema.get_name(), ms_to_sec(transition)))
        lamp.set_power(True, transition)
        await asyncio.sleep(ms_to_sec(transition))

    async def off(self, lamp, schema):
        transition = schema.get_transition()
        log("powering down {} over {}s.".format(schema.get_name(), ms_to_sec(transition)))
        lamp.set_power(False, transition)
        await asyncio.sleep(ms_to_sec(transition))

    def set_color(self, lamp, schema):
        hue, saturation, brightness, temperature = lamp.get_color()
        transition = schema.get_transition()

        if schema.has_hue():
            hue = schema.get_hue()

        if schema.has_saturation():
            saturation = schema.get_saturation()

        if schema.has_brightness():
            brightness = schema.get_brightness()

        if schema.has_temperature():
            temperature = schema.get_temperature()

        log("set color of lamp '{}' to [{}, {}, {}, {}] over transition {}s"
            .format(schema.get_name(), hue, saturation, brightness, temperature, ms_to_sec(transition)))

        lamp.set_color([hue, saturation, brightness, temperature], transition)

    async def process_event(self, lamp, schema):
        properties = [schema.has_hue, schema.has_saturation, schema.has_saturation, schema.has_temperature]

        log("event: {}".format(schema.to_json()))

        color_updated = False
        for changed in properties:
            if changed():
                color_updated = True

        update_color = lambda: self.set_color(lamp, schema) if color_updated else None

        if schema.has_power():
            if schema.get_power():
                update_color()
                await self.on(lamp, schema)
            else:
                await self.off(lamp, schema)
                update_color()

    def stop_jobs(self):
        running = len(self.jobs)
        if running > 0:
            log('stopping {} running jobs..'.format(running))
            for job in self.jobs:
                job.stop()
            self.jobs = []

    def get_device_by_name(self, name):
        for light in self.lights:
            if light.get_label() == name:
                return device

    def configure_alarms(self, config):
        self.stop_jobs()
        log('scheduling lamps..')

        for lamp_name in config:
            schemas = config[lamp_name].get_schemas()

            log("configuring lamp '{}'..".format(lamp_name))
            lamp = self.get_device_by_name(lamp_name)

            for schema in schemas:
                schema.set_name(lamp_name)
                cron = schema.get_cron()
                print("\t\t- {}".format(schema.to_json()))

                # save a ref to unschedule later.
                cron = crontab(cron, func=lambda schema=schema, lamp=lamp: self.process_event(lamp, schema), start=True)
                self.jobs.append(cron)
