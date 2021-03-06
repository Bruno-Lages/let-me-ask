module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
    ],
    rules: {
        'react/jsx-filename-extension': 0,
        'linebreak-style': 0,
        'react/react-in-jsx-scope': 0,
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'import/prefer-default-export': 0,
        'react/jsx-indent-props': 0,
    },
};
