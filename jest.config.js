module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/functions'],
  testMatch: ['**/functions/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!index.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/functions/__tests__/setup.ts']
};