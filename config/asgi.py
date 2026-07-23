"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import django
from starlette.applications import Starlette
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django.setup()

from django.core.asgi import get_asgi_application
django_app = get_asgi_application()

from api import web_api

application = Starlette(
    routes=[
        Mount("/api", app=web_api),
        Mount("/admin", app=django_app),
        Mount("/", app=StaticFiles(directory="static", html=True), name="static")
    ]
)