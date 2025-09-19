/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json', diagnostics: false }]
  },
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
  '^@oursynth/core$': '<rootDir>/packages/halo-ui/dist',
  '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/import-staging/'],
  modulePathIgnorePatterns: ['<rootDir>/import-staging/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
