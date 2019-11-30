from server.log import log
import yaml
import json

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
        log('Configuration parsed.')
        configurations = []

        for lamp in config['lamps']:
            lamp_config = LampConfiguration(lamp['name'])
            for schema in lamp['schema']:
                lamp_config.add_schema(SchemaConfiguration(**schema))

        return configurations


class LampConfiguration:
    """ contains the schema configuration for a simple lamp """

    def __init__(self, name):
        self.name = name
        self.schemas = []

    def add_schema(self, schema):
        self.schemas.append(schema)

    def get_name(self):
        return self.name


class SchemaConfiguration:
    """ holds configuration for a single trigger. """

    def __init__(self, **entries):
        self.__dict__.update(entries)

    def __getitem__(self, item):
        return self.__dict__[item]

    def get_transition(self):
        return self['transition']

    def get_hue(self):
        return self['hue']

    def get_cron(self):
        return self['cron']

    def get_saturation(self):
        return self['saturation']

    def get_brightness(self):
        return self['brightness']

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
        return 'hue' in self.__dict__

    def has_saturation(self):
        return 'saturation' in self.__dict__

    def has_temperature(self):
        return 'temperature' in self.__dict__

    def has_power(self):
        return 'power' in self.__dict__

    def to_json(self):
        return json.dumps(self)
