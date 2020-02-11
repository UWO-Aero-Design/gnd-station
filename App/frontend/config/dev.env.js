'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})

// module.exports = {
//   // ...
//   dev: {
//     proxyTable: {
//       // proxy all requests starting with /api to backend
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true
//       }
//     }
//   }
// }
