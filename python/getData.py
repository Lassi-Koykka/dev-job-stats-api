import requests;
import json;
import asyncio;
import aiohttp;
from pathlib import Path;
from collections import Counter;


#FUNCTIONS
def readKeywords(path):
    techList = []   
    """Read keywords from a text file where each value is on a seperate line
    """
    try:
        with open(path) as input_file:
            #stripping newline characters
            techList = [line.rstrip('\n') for line in input_file]
            techList = [line.upper() for line in techList]


    #if an error occurs, print the error.
    except Exception as e: print("Problem with technologies.txt\n--------------------------\n" + e)
    if len(techList) < 1:
        raise Exception("No keywords found")
    return techList

async def parseData(postings):
    """Fetch json, parse the data and prepare it to be turned into json"""
    
    keywordMentions = []

    for i in postings:
        s = i['descr'].upper()
        heading = i["heading"]
        company = i["company_name"]
        location = i["municipality_name"]
        link = "https://duunitori.fi/tyopaikat/tyo/" + i["slug"]

        #List of keywords found in post
        keywordsFound = list({x for x in KWList if x in s})

        for i in range(len(keywordsFound)):
        
            #strip whitespace and remove , and ) characters from the matches
            keywordsFound[i] = keywordsFound[i].strip()
            keywordsFound[i] = keywordsFound[i].replace(",", "").replace(")", "")

        #create company and location dictionaries
        if len(keywordsFound) > 0:
            if company in companies:
                companies[company]["technologies"] += keywordsFound
                companies[company]["jobs"].append({"heading": heading, "link": link, "technologies": list(set(keywordsFound)), "company": company, "location": location})

            else:
                companies[company] = dict()
                companies[company]["name"] = company
                companies[company]["technologies"] = keywordsFound
                companies[company]["jobs"] = []
                companies[company]["jobs"].append({"heading": heading, "link": link, "technologies": list(set(keywordsFound)), "company": company, "location": location})

            if location in locations:
                locations[location]["technologies"] += keywordsFound
                locations[location]["jobs"].append({"heading": heading, "link": link, "technologies": list(set(keywordsFound)), "company": company, "location": location})
            else:
                locations[location] = dict()
                locations[location]["name"] = location
                locations[location]["technologies"] = keywordsFound
                locations[location]["jobs"] = []
                locations[location]["jobs"].append({"heading": heading, "link": link, "technologies": list(set(keywordsFound)), "company": company, "location": location})

            keywordMentions += keywordsFound
    return keywordMentions

#Fetch the postings site json
async def fetch(url):
    """Execute an http call async
    Args:
        url: URL to call
    Return:
        responses: A dict like object containing http response
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            resp = await response.json(content_type=None)
            return resp

#fetch all postings
async def handleData():
    tasks = []
    allMentionsFound = []
    #call api to get all postings
    url = "https://duunitori.fi/api/v1/jobentries?search=koodari&search_also_descr=1&format=json"
    results = await fetch(url) 
    print("results gotten from: " + url)
    count = results["count"]
    tasks.append(parseData(results['results']))
    nextPage = results['next']

    while nextPage != None:
        url = nextPage
        results = await fetch(url)
        print("results gotten from: " + url)
        tasks.append(parseData(results['results']))
        nextPage = results['next']
    
    mentions = await asyncio.gather(*tasks, return_exceptions=True)

    for m in mentions:
        allMentionsFound += m

    return allMentionsFound, count

def formatAndCreateJson(count, kwMentions):
    """Format and create a usable json file from data"""
    global companies
    global locations
    techCount = dict()
    techCount = Counter(kwMentions)

    for key in companies:
        companies[key]["technologies"] = Counter(companies[key]["technologies"])
        companies[key]["jobs_count"] = len(companies[key]["jobs"])


    for key in locations:
        locations[key]["technologies"] = Counter(locations[key]["technologies"])
        locations[key]["jobs_count"] = len(locations[key]["jobs"])
    
    data["posts_count"] = count
    data["technologies"] = techCount
    data["companies"] = companies
    data["locations"] = locations

    jsonData = json.dumps(data)

    f = open("data.json", "w+")
    f.write(jsonData)

#VARIABLES
KWList = []
companies = dict()
locations = dict()
data = dict()

KWList = readKeywords(Path('./python/technologies.txt'))
allMentions, count = asyncio.run(handleData())
formatAndCreateJson(count, allMentions)


