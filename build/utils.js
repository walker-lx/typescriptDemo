var path = require('path')
var config = require('../config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var glob = require('glob')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}
// 页面模板
var PAGE_PATH = path.resolve(__dirname, '../src')
// var HTML_PATH = path.resolve(__dirname, '../src')
var merge = require('webpack-merge')

// 多入口配置
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + '/*.ts') // 同步匹配文件(如果是typescript需要将js改成ts)
  var map = {}
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    map[filename] = filePath
  })
  return map
}

// 多页面输出配置
exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*.html')
  let arr = []
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      inject: true
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}
// exports.cssLoaders = function(options) {
// 	options = options || {}

// 	var cssLoader = {
// 		loader: 'css-loader',
// 		options: {
// 			minimize: process.env.NODE_ENV === 'production',
// 			sourceMap: options.sourceMap
// 		}
// 	}
// 	// generate loader string to be used with extract text plugin
// 	function generateLoaders(loader, loaderOptions) {
// 		var loaders = [cssLoader]
// 		if (loader) {
// 			loaders.push({
// 				loader: loader + '-loader',
// 				options: Object.assign({}, loaderOptions, {
// 					sourceMap: options.sourceMap
// 				})
// 			})
// 		}

// 		// Extract CSS when that option is specified
// 		// (which is the case during production build)
// 		if (options.extract) {
// 			return ExtractTextPlugin.extract({
// 				use: loaders,
// 				fallback: 'vue-style-loader'
// 			})
// 		}
// 		else {
// 			return ['vue-style-loader'].concat(loaders)
// 		}
// 	}

// 	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
// 	return {
// 		css: generateLoaders(),
// 		postcss: generateLoaders(),
// 		less: generateLoaders('less'),
// 		sass: generateLoaders('sass', {
// 			indentedSyntax: true
// 		}),
// 		scss: generateLoaders('sass'),
// 		stylus: generateLoaders('stylus'),
// 		styl: generateLoaders('stylus')
// 	}
// }

// // Generate loaders for standalone style files (outside of .vue)
// exports.styleLoaders = function(options) {
// 	var output = []
// 	var loaders = exports.cssLoaders(options)
// 	for (var extension in loaders) {
// 		var loader = loaders[extension]
// 		output.push({
// 			test: new RegExp('\\.' + extension + '$'),
// 			use: loader
// 		})
// 	}
// 	return output
// }
