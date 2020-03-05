module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
                browsers: 'defaults'
            }
        }],
        '@babel/preset-typescript',
    ],
};
