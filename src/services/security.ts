import { validators } from "../utils/validators";
export const securityService={validateEmail:validators.email,validatePassword:validators.password,validatePhone:validators.phone,validateName:validators.fullName};
