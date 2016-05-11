__author__ = 'vladimirsusaya'
from trope_scraper import run_trope_scraper
from media_scraper import run_media_scraper
import pprint
import json
import shelve
import simplejson

CTR = 1000

pp = pprint.PrettyPrinter(indent=4)
url = 'http://tvtropes.org/pmwiki/pmwiki.php/Main/SignificantGreenEyedRedhead'

corpus = {}
queue = [ ['t', url] ]  #queue of urls to examine

#corpus = shelve.open("corpusfile")

#check for duplicate links
examined_tropes = [url]
examined_media = []

#try to balance media and tropes
consecutive_tropes = 0
consecutive_media = 0

#check which links failed
failed_tropes = []
failed_media = []
exception_ctr_t = 0
exception_ctr_m = 0

ext_count = 0
link_count = 0

trope_ctr = 0
media_ctr = 0

i = 0
while i < CTR: 
	i += 1
	ext_count += 1
	url = queue.pop(0)

	#try:
	if url[0] == 't':

		if consecutive_tropes > 200:
			queue.append(url)
			CTR += 1
			continue

		consecutive_tropes += 1
		consecutive_media = 0
		link_count += 1

		print("Trope")
		#insert scraper data into the corpus
		#scrapers return None value if it fails
		page_data = run_trope_scraper(url[1])

		if page_data is None:
			failed_tropes.append(url[1])
			continue

		corpus[str(i)] = page_data
		trope_ctr += 1

		try:
			#get the links and put them into the queue
			#don't put anything in the queue that we've seen already
			links = page_data["links"]
			for single_dict in links:
				if single_dict["link"] not in examined_media:
					queue.append(['m', single_dict["link"]])
					examined_media.append(single_dict["link"])
		except:
			exception_ctr_t += 1
			continue

	else:

		if consecutive_media > 200:
			queue.append(url)
			CTR += 1
			continue

		consecutive_media += 1
		consecutive_tropes = 0
		link_count += 1

		print("Media")
		#insert scraper data into git the corpus
		page_data = run_media_scraper(url[1])

		if page_data is None:
			failed_media.append(url[1])
			continue

		corpus[str(i)] = page_data
		media_ctr += 1

		#get the links and put them into the queue
		try:
			links = page_data[unicode('tropes', "utf-8")]
			for single_dict in links:
				if single_dict["link"] not in examined_tropes:
					queue.append(['t', single_dict["link"]])
					examined_tropes.append(single_dict["link"])
		except:
			exception_ctr_m += 1
			continue

	#except:
		#continue


json_data = json.dumps(corpus)
f = open('corpus.json', 'w')
f.write(json_data)

#corpus.close()

#links that failed
#ft = open('failed_t.txt', 'w')
#simplejson.dump(failed_tropes, ft)
#ft.close()
#fm = open('failed_m.txt', 'w')
#simplejson.dump(failed_media, fm)
#fm.close()

#useful information
print "loop iterations:"
print (ext_count)
print "links examined"
print link_count
print "items in corpus"
print (len(corpus.keys()))
print "tropes in corpus"
print trope_ctr
print "media in corpus"
print media_ctr
print "duplicate tropes detected:"
print (len(examined_tropes))
print "duplicate media detected:"
print (len(examined_media))
print "failed tropes:"
print (len(failed_tropes))
print "failed media:"
print (len(failed_media))
print "exception tropes:"
print (exception_ctr_t)
print "exception media"
print (exception_ctr_m)
#pp.pprint(corpus)
#pp.pprint(page_data)

