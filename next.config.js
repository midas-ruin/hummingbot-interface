const withTwin = require('./withTwin.js')

module.exports = withTwin({
  transpilePackages: ['@hummingbot/hbui'],
  reactStrictMode: true,
})

// module.exports = {
//   reactStrictMode: true,
//   compiler: {
//     styledComponents: true
//   }
// }
