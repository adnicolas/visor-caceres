const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // Solución al relative path hell basada en https://github.com/manfredsteyer/ngx-build-plus
      // y https://goenning.net/2017/07/21/how-to-avoid-relative-path-hell-javascript-typescript-projects/
      "@cotvisor": path.resolve(__dirname, './src/app/modules/@cotvisor/'),
      "@cotvisor-admin": path.resolve(__dirname, './src/app/modules/@cotvisor-admin/'),
      "@geospatial": path.resolve(__dirname, './src/app/modules/geospatial/'),
      "@theme": path.resolve(__dirname, './src/app/modules/theme/')
    }
  }
}
