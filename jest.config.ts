module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  coverageProvider: 'babel',
  coveragePathIgnorePatterns: ['<rootDir>/coverage', '/node_modules/']
}