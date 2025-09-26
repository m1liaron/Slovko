const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string) => password.length >= 6;

export { isValidEmail, isValidPassword };
