import asyncio
from server import webserver
from server import log as logger


try:
    loop = asyncio.get_event_loop()
    webserver.serve(True)
    loop.run_forever()
except KeyboardInterrupt:
    logger.log('timer was stopped by user.')
    pass
