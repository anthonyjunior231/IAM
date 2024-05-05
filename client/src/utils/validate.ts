export const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // check if password is valid
  export const isStrongPassword = (password: string) => {
    if (import.meta.env.MODE !== "production") return true;
  
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numbersRegex = /[0-9]/;
    const lengthRegex = /.{12,16}/;
  
    // if true return boolean true or otherwise if false
    if (
      password.match(uppercaseRegex) &&
      password.match(lowercaseRegex) &&
      password.match(numbersRegex) &&
      password.match(lengthRegex)
    ) {
      return true;
    } else {
      return false;
    }
  };

  