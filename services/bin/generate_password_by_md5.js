#!/usr/bin/env node

const U = require('../app/lib/utils');

const salt = 'YigRivsMpZYHXZis';
const password = 'baiyu123';

const generatePassword = () => {
  const pass = U.md5(`${salt}${U.md5(password)}${salt}`);
  return pass;
};

console.log(generatePassword(), salt);
