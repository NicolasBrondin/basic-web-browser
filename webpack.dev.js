new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV), //important to override webpack mode
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
})