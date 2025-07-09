module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.(test|spec).ts?(x)", "**/?(*.)+(test|spec).ts?(x)"],
};
