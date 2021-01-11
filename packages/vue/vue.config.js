module.exports = {
  publicPath: '/LhnUI',
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(gif|jpg|png|woff|svg|eot|ttf|cur)\??.*$/)
      .use("url-loader")
      .loader("url-loader")
      .options({
        limit: 8192,
        name: "images/[hash:8].[name].[ext]",
      })
      .end()
  },
}
