module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
    "indent": [0, "tab"],
    // if while function 后面的{必须与if在同一行，java风格。
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
    "semi": [0, "always", {"omitLastInOneLineBlock": true}],
    // 禁止函数圆括号之前有一个空格
    "space-before-function-paren": ["error", "never"],
    // 允许空格和tab混合使用
    "no-mixed-spaces-and-tabs": 0,
    "no-tabs": 0,
    // 允许使用 ==
    "eqeqeq": 0
  }
}
