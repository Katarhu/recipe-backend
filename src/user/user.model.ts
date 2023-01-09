import mongoose from "mongoose";
import * as Joi from 'joi';

export enum UserRole {
  USER="user",
  ADMIN="admin"
}

export interface IUser {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

export const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true},
  password: { type: String, required: true},
  email: { type: String, required: true },
  role: { type: String, required: true, default: UserRole.USER }
});

// JOI

const emailValidationMessages = {
  "string.empty": "Email should not be empty",
  "string.required": "Email is required",
  "string.email": "Email should be valid"
};

const passwordValidationMessages = {
  "string.empty": "Password should not be empty",
  "string.required": "Password is required"
}

const usernameValidationMessages = {
  "string.empty": "Username should not be empty",
  "string.required": "Username is required"
}

export const userCredentialsJoi = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages(emailValidationMessages),
  password: Joi.string()
    .required()
    .messages(passwordValidationMessages)
}).options({allowUnknown: true});


export const createUserJoi = Joi.object({
  username: Joi.string()
    .required()
    .messages(usernameValidationMessages),
  password: Joi.string()
    .required()
    .messages(passwordValidationMessages),
  email: Joi.string()
    .email()
    .required()
    .messages(emailValidationMessages),
}).options({allowUnknown: true});
