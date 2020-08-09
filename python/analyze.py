import requests;
import json;

url = "http://localhost:5000/api"
response = requests.get(url)
jobEntries = response.json()
entries = jobEntries['results']

print(entries)

for e in entries:
    print(e['descr'])
    

