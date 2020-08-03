import asyncio
import sys
from server import webserver
from server import log as logger
from server import league

try:
    loop = asyncio.get_event_loop()

    if (sys.argv[1] == '--lol'):
        loop.run_until_complete(league.run(loop, sys.argv[2]))
    else:
        webserver.serve(True)
        loop.run_forever()
except KeyboardInterrupt:
    logger.log('timer was stopped by user.')
    pass
