const generator = require('generate-password');

export const generateKey = async () => {
  const password = generator.generate({
    length: 6,
    numbers: true,
    uppercase: false,
  });

  return password;
};
