# lifx-circadian
Small python script to control on/off for LIFX lamps using the LAN protocol. The LIFX application has support for configuring day/nighttime cycles but does only support monophasic sleep, how traditional.

More information on alternatives to monophasic sleep here: [polyphasic.net](https://polyphasic.net/)

### Installation

Requires python 3.6.3+ for asyncio.

```console
pip install aiocron, lifxlan, pyyaml
python main.py
```

### Configuration

This is the sample configuration

```yaml
---
fade:
    day: 300
    night: 900
default_color:
      # hue
    - 0xCBCB
      # saturation
    - 0xFFFF
      # brightness
    - 0xAFFF
      # kelvin.
    - 2500
lamps:
    - name: "lamp #1"
      schema:
          - power: False
            cron: "15 9 * * *"
          - power: True
            cron: "0 1 * * *"
          - power: False
            cron: "45 3 * * *"
          - power: True
            cron: "30 7 * * *"
    - name: "lamp #2"
      schema:
          - power: False
            cron: "30 8 * * *"
```

Replace `lamp #1` with the label/name of the discovered lamps.

Lamps will start to power up/down when the expression triggers over time, as defined by the fade configuration.
