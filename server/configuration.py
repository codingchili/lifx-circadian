import yaml
import json


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
