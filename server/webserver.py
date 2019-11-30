from aiohttp import web
from server import lamps

root = './web/build/es6prod'
routes = web.RouteTableDef()
lamps = lamps.CircadianLifx()


async def index(request):
    return web.FileResponse('{}/index.html'.format(root))


@routes.get('/lamps')
async def list_lamps(request):
    return web.json_response({'ok': True})


@routes.post('/lamp/configure')
async def configure_lamp(request):
    return web.json_response({'ok': True})


def serve(web_interface):
    app = web.Application()
    router = app.router
    router.add_routes(routes)

    if web_interface:
        app.add_routes([web.get('/', index)])
        router.add_static('/', root)

    web.run_app(app)
