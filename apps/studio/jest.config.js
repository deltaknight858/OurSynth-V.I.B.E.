module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx',
                module: 'commonjs',
                target: 'es2020',
                skipLibCheck: true,
                strict: false,
                esModuleInterop: true,
                moduleResolution: 'node',
                isolatedModules: true,
            }
        }],
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/apps/domains/src/$1',
        '^test/utils$': '<rootDir>/test/utils.ts',
        '^@mui/utils/macros/MuiError\\.macro$': '<rootDir>/test/mocks/MuiError.js',
        '^chai$': '<rootDir>/test/mocks/chai.ts'
    },
    moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx', 'json', 'node'],
    transformIgnorePatterns: [
        '/node_modules/(?!chai)/', // transform chai, ignore others
    ],
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    testMatch: [
        '**/__tests__/**/*.(ts|tsx|js)',
        '**/*.(test|spec).(ts|tsx|js)'
    ]
};