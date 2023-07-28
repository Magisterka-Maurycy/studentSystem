import { z } from "@builder.io/qwik-city";
export const authUrl = "http://auth.localhost/"
// export const fileSchema = z
    // .instanceof(File)
export const emailSchema = z
    .string()
    .min(1, 'Please enter your email.')
    .email('The email address is badly formatted.')

export const passwordSchema = z
    .string()
    .min(1, 'Please enter your password.')
    .min(4, 'You password must have 4 characters or more.')

export const userNameSchema = z
    .string()
    .min(1, 'Please enter your user name.')

