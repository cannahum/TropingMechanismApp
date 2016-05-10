from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
import json

def home(req):
    return render(req, 'main.html', {'STATIC_URL': settings.STATIC_URL})

def simple_search(req):
   
    if req.method == 'GET':
        print('alrighty then!')
        print(req.GET)
        print(req.GET[req.GET.keys()[0]])
    else:
        return {}
    return HttpResponse(json.dumps({'hello':'world'}))

def advanced_search(req):

    if req.method == 'GET':
        print('advanced search')
    else:
        return {}
    return HttpResponse(json.dumps({'hello':'complicated'}))
