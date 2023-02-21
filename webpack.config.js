module.exports = (env, options) => {
  return {
    mode: "production",
    entry: {
      main: "./src",
      sdk: "./games-sdk.js",
    },

    output: {
      publicPath: "/dist/",
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
  };
};
