const path = require('path')
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  cssModules: true
})
module.exports = {
  env:{
    BASE_URL:'http://localhost:3000/',
    API_URL:'https://run.mocky.io/v3'
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
