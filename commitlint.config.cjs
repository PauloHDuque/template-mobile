module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'perf', 'style', 'refactor', 'test', 'chore'],
    ],
    'scope-empty': [2, 'always'],
    'subject-empty': [2, 'never'],
  },
};
