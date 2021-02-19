module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globalSetup: '<rootDir>/test/setup.js',
  globalTeardown: '<rootDir>/test/teardown.js',
  setupFilesAfterEnv: ['<rootDir>/test/setupAfterEnv.js'],
  testEnvironment: '<rootDir>/test/environment.js',
};
