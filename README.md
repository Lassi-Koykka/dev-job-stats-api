# Welcome to Finnish Dev Job API
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)

[Visit the live version!](http://dev-job-api.herokuapp.com/api/)

The API uses a Node.js / Express backend which requests, parses, and uses python child process to analyze data about Finnish developer job postings gotten from the Duunitori API every 15 minutes.

Requests to the API are limited to 100 requests every 15 minutes.

## Main Endpoints

| Method  | URL| Output |
| ------| ----- | -----|
| GET  | /api  | Displays the API page. Future plan is to add a page describing the endpoints. |
| GET  | /api/posts  | Will respond with a Json of all the original job postings gotten from the Duunitori API. |
| GET  | /api/data  | Will respond with a Json of all data parsed from the job postings. |
| GET  | /api/data/locations  | Will respond with a Json of the parsed job data organized by their locations. |
| GET  | /api/data/locations/:location  | Will respond with a Json data of a specific location with the given name.|
| GET  | /api/data/companies  | Will respond with a Json of the parsed job data organized by the company who made the posting.|
| GET  | /api/data/companies/:company  | Will respond with a Json data of a specific company with the given name.|
| GET  | /api/data/technologies| Will respond with a Json data of all technologies mentioned in the job descriptions.|
| GET  | /api/data/technologies/:tecnology  | Will respond with a Json data of a specific technology with the given name.|
| GET  | /api/data/posts_count| Will respond with a the number of all the job postings parsed.|

## Further endpoints in /api/data/locations/:location
| Method  | URL| Output |
| ------| ----- | -----|
| GET  | /name | Will respond with the name of the location.|
| GET  | /technologies | Will respond with a Json object of all technology keyword occurrances mentioned in job postings with this location.|
| GET | /technologies/:technology | Will respond with the number of occurrances of the specified keyword in the locations job postings. |
| GET  | /jobs | Will respond with a Json list of all jobs in the location.|
| GET  | /jobs_count | Will respond with the number of jobs in the location.|

## Further endpoints in /api/data/companies/:company
| Method  | URL| Output |
| ------| ----- | -----|
| GET  | /name | Will respond with the name of the company|
| GET  | /technologies | Will respond with a Json object of all technology keyword occurrances mentioned in the company's job postings.|
| GET | /technologies/:technology | Will respond with the number of occurrances of the specified keyword in the company's job postings. |
| GET  | /jobs | Will respond with a Json list of all jobs from the company.|
| GET  | /jobs_count | Will respond with the number of jobs in the company.|

## Further endpoints in /api/data/technologies/:technology
| Method  | URL| Output |
| ------| ----- | -----|
| GET  | /jobs | Will respond with a Json list of all jobs which mention the specified technology.|
| GET  | /jobs_count | Will respond with the number of jobs which mention the specified technology.|

## Further endpoints in :location/jobs, :company/jobs, and :technology/jobs
| Method  | URL| Output |
| ------| ----- | -----|
| GET  | /:indx | Will respond with a Json of the specific job with that index.|
| GET  | /jobs_count | Will respond with the number of jobs which mention the specified technology.|
| GET  | /:indx/heading | Will respond with the heading of the specific job with that index.|
| GET  | /:indx/link| Will respond with the Duunitori URL link of the job posting.|
| GET  | /:indx/technologies | Will respond with a list of all the technologies mentioned in the job posting.|
| GET  | /:indx/company| Will respond with the company of the specific job with that index.|
| GET  | /:indx/location| Will respond with the location of the specific job with that index.|

### Example request:
````javascript
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};
let url = "http://http://dev-job-api.herokuapp.com/api/data/locations/tampere/jobs/1/heading"

fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
````

 
### If you would like to recommend improvements to this rest api please leave an issue. Thank you and have fun building!
