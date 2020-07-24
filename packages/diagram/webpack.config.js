const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".json", ".tsx"],
  },
  mode: "production",
  entry: {
    main: "./src/index.ts",
    index: "./example/index.tsx"
  },
  output: {
    filename: "[name].umd.min.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: { modules: true, onlyLocals: false },
              },
              "sass-loader",
            ],
          },
          {
            use: ["style-loader", "css-loader", "sass-loader"],
          },
        ],
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  externals: {
    vue: "vue",
  },
};
