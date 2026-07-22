"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from starlette.applications import Starlette
from api import web_api
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_app = get_asgi_application()

application = Starlette(
    routes=[
        Mount("/api", app=web_api),
        Mount("/admin", app=django_app),
        Mount("/", app=StaticFiles(directory="static", html=True), name="static")
    ]
)