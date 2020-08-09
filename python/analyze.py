import requests;
import json;
import time;
from collections import Counter;

long_list = []
matches = []
techCount = dict()
companies = dict()
locations = dict()
data = dict()

#Reading technology keywords from file
try:
    with open('./python/technologies.txt') as input_file:
        #stripping newline characters
        long_list = [line.rstrip('\n') for line in input_file]
        long_list = [line.upper() for line in long_list]
#if an error occurs, print the error.
except Exception as e: print(e)
#print(long_list)


#call api to get all postings
url = "http://localhost:5000/api"
response = requests.get(url)
jobEntries = response.json()
entries = jobEntries['results']

#make the description uppercase and find keywords that appear at least once in a description
for i in entries:
    s = i['descr'].upper()
    heading = i["heading"]
    company = i["company_name"]
    location = i["municipality_name"]
    link = "https://duunitori.fi/tyopaikat/tyo/" + i["slug"]

    #List of keywords found in post
    keywordsFound = list({x for x in long_list if x in s})

    for i in range(len(keywordsFound)):

        #strip whitespace and remove , and ) characters from the matches
        keywordsFound[i] = keywordsFound[i].strip()
        keywordsFound[i] = keywordsFound[i].replace(",", "").replace(")", "")

    #add a company to companies dictionary if it doesn't already exist and add the keywords found in the posting
    if len(keywordsFound) > 0:
        if company in companies:
            companies[company]["technologies"] += keywordsFound
            companies[company]["jobs"].append({"heading": heading, "link": link, "location": location})

        else:
            companies[company] = dict()
            companies[company]["name"] = company
            companies[company]["technologies"] = keywordsFound
            companies[company]["jobs"] = []
            companies[company]["jobs"].append({"heading": heading, "link": link, "location": location})

        if location in locations:
            locations[location]["technologies"] += keywordsFound
            locations[location]["jobs"].append({"heading": heading, "link": link, "location": location})
        else:
            locations[location] = dict()
            locations[location]["name"] = location
            locations[location]["technologies"] = keywordsFound
            locations[location]["jobs"] = []
            locations[location]["jobs"].append({"heading": heading, "link": link, "location": location})

    matches = matches + keywordsFound

    
#Use counter to make a dictionaries of the occurrances of keywords
techCount = Counter(matches)

for key in companies:
    companies[key]["technologies"] = Counter(companies[key]["technologies"])
    companies[key]["jobs_count"] = len(companies[key]["jobs"])


for key in locations:
    locations[key]["technologies"] = Counter(locations[key]["technologies"])
    locations[key]["jobs_count"] = len(locations[key]["jobs"])

data["technologies"] = techCount
data["companies"] = companies
#data["locations"] = locations

json = json.dumps(data)

print(json, flush=True)





    

