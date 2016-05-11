Start-Up Instructions
 - how to build the system “from scratch”, install the code, and run it.
 - Make clear any dependencies on external packages, including version. For your corpus, include commented scripts which can acquire a new corpus (assuming an ever-changing web) as well as the (compressed) static corpus data you use in your demo.

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