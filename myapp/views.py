from django.shortcuts import render
from django.conf import settings

def home(req):
    return render(req, 'main.html', {'STATIC_URL': settings.STATIC_URL})
