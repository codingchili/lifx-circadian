from aiohttp import web
from server import lamps, configuration

root = './web/build/es6prod'
routes = web.RouteTableDef()

async def index(request):
    return web.FileResponse('{}/index.html'.format(root))


@routes.get('/lamps')
async def list_lamps(request):
    """ lists all discovered lamps, if discovery has not run in a while performs a new scan. """
    lights = lifx.get_lights()
    response = []

    for light in lights:
        name = light.get_label()
        color, saturation, brightness = configuration.color_transform(light.get_color())

        response.append({
            'name': name,
            'color': color,
            'power': True if light.get_power() > 0 else False,
            'saturation': saturation,
            'brightness': brightness,
            'schemas': list(map(lambda entry: entry.__dict__, config[name].get_schemas()))
        })
    return web.json_response(response)


@routes.post('/lamp/configure')
async def configure_lamp(request):
    """ configures a set of triggers on which to modify the state of a lamp. """
    return web.json_response({'ok': True})


@routes.post('/lamp/update')
async def update_lamp(request):
    """ updates the current state of a lamp, hue, brightness and saturation. """

    # todo: convert from API to LIFX values?
    # todo: call set_color in lamps.py?

    print(await request.json())
    return web.json_response({'ok': True})


def serve(web_interface):
    # discover lamps on the local network.
    global lifx
    lifx = lamps.CircadianLifx()

    # load lamp configuration and schedule timers.
    global config
    config = configuration.load_from_file()
    lifx.configure_alarms(config)

    app = web.Application()
    router = app.router
    router.add_routes(routes)

    if web_interface:
        app.add_routes([web.get('/', index)])
        router.add_static('/', root)

    web.run_app(app)
