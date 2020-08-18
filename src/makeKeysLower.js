let makeKeysLower = (data) => {
    var key, keys = Object.keys(data);
    var n = keys.length;
    var formattedData={}
    while (n--) {
      key = keys[n];
      if (key.includes('Helsinki')){
        formattedData['helsinki'] = data[key];
      } else {
        formattedData[key.toLowerCase().replace(/ /g, '-')] = data[key];
      }
    }
    return formattedData
  }

  function makeDataKeysLower(data) {
    Object.keys(data).forEach(key => {
        if( key !== 'posts_count') {
          data[key] = makeKeysLower(data[key])
        }
      });
      data = makeKeysLower(data)
      return data
  }

  module.exports = makeDataKeysLower