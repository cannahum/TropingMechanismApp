from bs4 import BeautifulSoup, SoupStrainer
import lxml
import requests
import re
import pprint

def run_media_scraper(my_url):

    try:
        url = my_url
        html_doc = requests.get(url)
        soup = BeautifulSoup(html_doc.content, 'lxml')

        #this is where we put the information we scrape
        page_data = {}

        #article text
        page_data["text"] = soup.find("div", class_="page-content").get_text()

        #image link
        try:
            image_link = soup.find("img", class_="embeddedimage")['src']
            page_data["imagelink"] = image_link
        except:
            page_data["imagelink"] = ""

        #title string
        page_data["title"] = soup.title.string

        #indicating if this is a trope or media link
        page_data["doctype"] = "media"

        #indicating the type of media of this link
        page_data["mediatype"] = re.search(r"(?<=http://tvtropes.org/pmwiki/pmwiki.php/)[A-Za-z]+", url).group(0)

        #creates list of categories"
        category_list = []

        trope_list = []

        for tropes in soup.find_all("a", class_="twikilink", ):
            href = tropes.get('href')
            clean = href.strip()

            if (clean).startswith('/pmwiki/pmwiki.php'):
                clean = 'http://tvtropes.org' + clean

            #make sure we don't insert any non-trope links
            if (clean).startswith('http://tvtropes.org') and not (clean).startswith('http://tvtropes.org/pmwiki/pmwiki.php/Main'):
                continue

            trope_list.append({"trope": tropes.string.replace(".", ""), "link": clean})

        page_data["tropes"] = trope_list

        return page_data
    except:
        return None

if __name__=="__main__":
    page_data = run_media_scraper('http://tvtropes.org/pmwiki/pmwiki.php/Literature/HarryPotter')    # Use the following three lines to preview output with prettyprint
    pp = pprint.PrettyPrinter(indent=4)
    pp.pprint(page_data)
