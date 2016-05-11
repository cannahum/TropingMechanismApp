Start-Up Instructions

How to Build the System:
1. run 'python manager.py' to get the corpus
2. start up ElasticSearch by navigating to where you have installed ElasticSearch and running './bin/elasticsearch'
3. run 'python build_index.py' in order to build our index
4. run 'python manage.py runserver' to start up the local Django server
5. open web-browser and navigate to 'http://localhost:8000/' to see the local version of the application

Dependencies on External Packages:
- Beautiful Soup - bs4-0.0.1
- ElasticSearch - elasticsearch-2.2.0
- lxml - lxml-3.6.0
- for corpus generation from tvtropes.org simply run 'python manager.py' to get the most up to date version of our corpus

Purpose of each code module (file): should briefly describe the purpose of each code module (file) 
- build_index.py
    Builds the index for ElasticSearch, and query functions for ElasticSearch. Requires Mapping.json
- manager.py
	Creates the corpus in a JSON file. Does this by starting at a hard-coded URL and examining the links it points to, which it adds to a queue. It pops from the queue and calls either the trope or media scraper depending on what kind of page it is (this is required as both pages have different layouts). It detects and avoids duplicate links, and balances the number of tropes and media documents put into the corpus.
- media_scraper.py
	Creates the title/text/links field for a media page on TVTropes.
- trope_scraper.py
	Creates the title/text/links field for a trope page on TVTropes.
- json_to_shelve.py
	Creates a shelve file from the json corpus file. Separated out so that we do not need to wait the ~10 minutes for the manager to process all the links