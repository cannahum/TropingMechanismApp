__author__ = 'Tiffany Chen'

from elasticsearch import Elasticsearch, helpers
import sys
import json

es = Elasticsearch()

json_data = open('mapping.json').read()
body = json.dumps(json.loads(json_data))

##do bulk loading
def format_action(id, value):
	return {
		"_index": "tropes_and_media",
		"_type": "item",
		"_id": int(id),
		"_source": value
	}

## the method to create the index
def buildindex():
    ts_index = es.indices.create(index = "tropes_and_media", body = body)
    items = json.load(open('corpus.json'))
    actions = []
    for key, value in items.iteritems():
	    actions.append(format_action(key, value))
    helpers.bulk(es, actions, stats_only = True, request_timeout=60)
    es.indices.refresh(index='tropes_and_media')

##QUERY METHODS
'''query by disjunctive no document type'''
def q_mw_query(query):
    res = es.search(index='tropes_and_media', doc_type='item', body={'query':{'multi_match':{'query':query, 'type': 'best_fields','fields': ['title', 'text'],'operator':'and'}}})
    res['hits']['hits']
    return res

'''query by disjunctive'''
def q_mw(dtype, query):
    res = es.search(index='tropes_and_media', doc_type='item', body={"query": {
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
})
    return res

'''query by conjunctive, no document type'''
def q_phr_query(phrase):
    res = es.search(index='tropes_and_media', doc_type='item', body={'query':{'multi_match':{'query': phrase, 'type': 'phrase', 'fields':['title']}}})
    return res

'''query by conjunctive'''
def q_phr(dtype, phrase):
    res = es.search(index='tropes_and_media', doc_type='item', body={"query":{
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
    }}
})
    return res

buildindex()
