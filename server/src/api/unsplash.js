const { createApi } = require('unsplash-js');

const unsplash = createApi({
  accessKey: 'MY_ACCESS_KEY',
});


module.exports = unsplash;