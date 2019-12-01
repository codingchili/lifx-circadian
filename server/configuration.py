from server.log import log
import colorsys
import yaml
import json
import math

# yaml file with configuration.
CONFIG_FILE = 'config.yaml'


def sec_to_ms(seconds):
    return seconds * 1000


def ms_to_sec(ms):
    return ms / 1000


def load_from_file():
    log("loading configuration from '{}'..".format(CONFIG_FILE))
    with open(CONFIG_FILE, 'r') as file:
        config = yaml.safe_load(file)
        log('configuration parsed.')
        configurations = []

        for lamp in config['lamps']:
            lamp_config = LampConfiguration(lamp['name'])
            for schema in lamp['schema']:
                lamp_config.add_schema(SchemaConfiguration(**schema))
            configurations.append(lamp_config)

        return configurations


class LampConfiguration:
    """ contains the schema configuration for a simple lamp """

    def __init__(self, name):
        self.name = name
        self.schemas = []

    def add_schema(self, schema):
        self.schemas.append(schema)

    def get_schemas(self):
        return self.schemas

    def get_name(self):
        return self.name


class SchemaConfiguration:
    """ holds configuration for a single trigger. """

    def __init__(self, **entries):
        self.name = ''
        self.__dict__.update(entries)

    def __getitem__(self, item):
        return self.__dict__[item]

    def set_name(self, name):
        self.name = name

    def get_name(self):
        return self.name

    def get_transition(self):
        return sec_to_ms(self['transition'])

    def get_hue(self):
        hex_color = self['color'].lstrip('#')
        rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        hls = colorsys.rgb_to_hls(rgb[0], rgb[1], rgb[2])
        return math.trunc(hls[0] * 360) * 182  # adjust for 0-65535 range.

    def get_cron(self):
        return self['cron']

    def get_saturation(self):
        return math.trunc(self['saturation'] * 256 * 256 - 1)

    def get_brightness(self):
        return math.trunc(self['brightness'] * 256 * 256 - 1)

    def get_power(self):
        return self['power']

    def get_temperature(self):
        return self['temperature']

    def has_cron(self):
        return 'cron' in self.__dict__

    def has_transition(self):
        return 'transition' in self.__dict__

    def has_brightness(self):
        return 'brightness' in self.__dict__

    def has_hue(self):
        return 'color' in self.__dict__

    def has_saturation(self):
        return 'saturation' in self.__dict__

    def has_temperature(self):
        return 'temperature' in self.__dict__

    def has_power(self):
        return 'power' in self.__dict__

    def to_json(self):
        return json.dumps(self.__dict__)