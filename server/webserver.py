from aiohttp import web
from server import lamps, configuration

root = './web/build/es6prod'
routes = web.RouteTableDef()

# discover lamps on the local network.
lifx = lamps.CircadianLifx()

# load lamp configuration and schedule timers.
lifx.configure_alarms(configuration.load_from_file())


async def index(request):
    return web.FileResponse('{}/index.html'.format(root))


@routes.get('/lamps')
async def list_lamps(request):
    """ lists all discovered lamps, if discovery has not run in a while performs a new scan. """
    lights = lifx.get_lights()
    response = []

    for light in lights:
        response.append({
            'name': light.get_label(),
            'color': light.get_color()
            #'schemas': configuration.get()? # get from config by name?
        })

    return web.json_response(response)


@routes.post('/lamp/configure')
async def configure_lamp(request):
    """ configures a set of triggers on which to modify the state of a lamp. """
    return web.json_response({'ok': True})


@routes.post('/lamp/update')
async def update_lamp(request):
    """ updates the current state of a lamp, hue, brightness and saturation. """
    return web.json_response({'ok': True})


def serve(web_interface):
    app = web.Application()
    router = app.router
    router.add_routes(routes)

    if web_interface:
        app.add_routes([web.get('/', index)])
        router.add_static('/', root)

    web.run_app(app)
