import json from 'rollup-plugin-json';

module.exports = {
    input: 'build/FilesList.js',
    externals: [
      "jquery",
      "jquery/jquery",
      "knockout",
      "moment"
    ],
    output: {
        file: 'build/FilesList.build.js',
        format: 'cjs'
    },
    plugins: [
      json()
    ]
};