module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    babelOptions: {
      configFile: '/babel.config.js',
    },
  },
};
