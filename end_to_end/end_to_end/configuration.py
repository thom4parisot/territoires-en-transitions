"""Environment variables"""
from os import environ

AUTH_USER_EMAIL = environ.get("AUTH_USER_EMAIL", "")
AUTH_USER_PASSWORD = environ.get("AUTH_USER_PASSWORD", "")
