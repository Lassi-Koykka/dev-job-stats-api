//Request and deliver all the job postings matching the given query from the duunitori API
async function deliverPostings(req, res) {
  
    url = `https://duunitori.fi/api/v1/jobentries?
    ${req.query.area !== undefined ? `area=${req.query.area}&` : ''}
    &search=koodari${req.query.words !== undefined ? `,${req.query.words}` : ''}
    &search_also_descr=1
    &format=json`;
    
    console.log(url)
    data = await fetch(url).then((response) => {
      return response.json();
    });
    
    results = data.results;
    
    while (data.next !== null) {
      data = await fetch(data.next).then((response) => {
        return response.json();
      });
      results = results.concat(data.results);
    }
    
    delete data.next;
    data.query = data.previous;
    delete data.previous;
    data.results = results;
    
    console.log(data.results.length);
    
    res.json(data);
  }

  module.exports = deliverPostings;