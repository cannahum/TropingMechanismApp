from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, HttpRequest
import requests
import json
import os
from pprint import pprint


def home(req):
    return render(req, 'main.html', {'STATIC_URL': settings.STATIC_URL})


def call_es(query):
    response = requests.post('http://localhost:9200/tropes_and_media/item/_search', data=query)
    return response.content


def q_phr_type(dtype, phrase):
    body={
        "query":{
            "filtered":{
                "query":{
                    "multi_match":{
                        "query":phrase,
                        "type": "phrase",
                        "fields":["title"]
                    }
                },
                "filter":{
                    "term":{
                        "doctype": dtype
                    }
                }
            }
        }
    }
    results = call_es(json.dumps(body))
    return json.loads(results)['hits']['hits']

def q_phr(phrase):
    body={
        'query':{
            'multi_match':{
                'query': phrase,
                'type': 'phrase',
                'fields':['title']
            }
        }
    }
    results = call_es(json.dumps(body))
    return json.loads(results)['hits']['hits']


def q_mw(query):
    body={
        'query':{
            'multi_match':{
                'query':query,
                'type': 'best_fields',
                'fields': ['title', 'text'],
                'operator':'and'
            }
        }
    }
    results = call_es(json.dumps(body))
    return json.loads(results)['hits']['hits']

def q_mw_type(dtype, query):
    body={
        "query": {
            "filtered": {
                "query": {
                    "multi_match":{
                        "query":query,
                        "type":"best_fields",
                        "fields":["title", "text"],
                        "operator": "and"
                    }
                },
                "filter": {
                    "term": {"doctype": dtype}
                }
            }
        }
    }
    results = call_es(json.dumps(body))
    return json.loads(results)['hits']['hits']


def process(res):
    a = {}
    a['id'] = res['_id']
    a['score'] = res['_score']
    a['doctype'] = res['_source']['doctype']

    if a['doctype'] == 'media':
        a['mediatype'] = res['_source']['mediatype']
        
    a['image'] = res['_source']['imagelink']
    a['title'] = res['_source']['title']
    a['text'] = res['_source']['text']

    if a['doctype'] == 'trope':
        a['links'] = res['_source']['links']
    else:
        a['links'] = res['_source']['tropes']
        
    return a


def make_query(req):
    if req.method == 'GET':
        print('alrighty then!')
        print(req.GET)
        print(req.GET[req.GET.keys()[0]])
        res = q_phr_type('media', req.GET[req.GET.keys()[0]])
        res = [process(hit) for hit in res]
        return HttpResponse(json.dumps(res), content_type='application/json')
    else:
        return {}
    

def advanced_search(req):

    if req.method == 'GET':
        print('advanced search')
    else:
        return {}
    return HttpResponse(json.dumps({'hello':'complicated'}))
