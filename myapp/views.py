from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
import json
import os
import shelve

with open(os.path.join(settings.PROJECT_ROOT, 'corpus.json')) as json_file:
    json_data = json.load(json_file)

shelf = shelve.open(os.path.join(settings.PROJECT_ROOT, 'ds'))
print(type(shelf))


def home(req):
    return render(req, 'main.html', {'STATIC_URL': settings.STATIC_URL})


def arrayify(data):
    return [value for key, value in data.iteritems()]
    
def simple_search(req):
   
    if req.method == 'GET':
        print('alrighty then!')
        print(req.GET)
        print(req.GET[req.GET.keys()[0]])
        data = arrayify(json_data)
        return HttpResponse(json.dumps(data), content_type='application/json')
    else:
        return {}
    

def advanced_search(req):

    if req.method == 'GET':
        print('advanced search')
    else:
        return {}
    return HttpResponse(json.dumps({'hello':'complicated'}))
