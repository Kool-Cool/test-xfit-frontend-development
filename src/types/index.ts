export type UserRole = 'CUSTOMER' | 'ADMIN' | 'OTHER'

export interface UserI {
  credentials: string[] // Assuming it's an array of strings; update the type if needed
  id: string
  name: string
  email: string
  emailVerified: string // ISO string format
  image: string | null
  userType: UserRole // Extend as needed
  otp: string | null
  otpExpires: string | null // ISO string format
  createdAt: string // ISO string format
  updatedAt: string // ISO string format
}

export interface ResponseType<T> {
  data: T | null
  message: string
}

/**
 * @example 
//  interface GymDetailsType {
//   id?: string;
//   name?: string;
//   address?: {
//     city?: string;
//     zipCode?: string;
//     details?: {
//       landmark?: string;
//     };
//   };
// }
// Apply the utility type to make 'id' required at all levels
export type Gym = DeepMakeFieldRequired<GymDetailsType, 'id'>;
// Resulting type Gym:
// {
//   id: string;
//   name?: string;
//   address?: {
//     city?: string;
//     zipCode?: string;
//     details?: {
//       landmark?: string;
//     };
//   };
// }
 */
// export type DeepMakeFieldRequired<T, K extends string> = T extends object
//   ? {
//       [P in keyof T]: P extends K
//         ? NonNullable<T[P]> // Ensure the specific field is required
//         : T[P] extends object // If the field is an object, recurse
//           ? DeepMakeFieldRequired<T[P], K>
//           : T[P] // Otherwise, keep it as is
//     }
//   : T
export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
export type DeepMakeRequired<T, K extends keyof T> = T extends object
  ? {
      [P in keyof T]: P extends K
        ? NonNullable<T[P]> // Ensure the specific field is required
        : T[P] extends object // If the field is an object, recurse
          ? DeepMakeRequired<T[P], keyof T[P]>
          : T[P] // Otherwise, keep it as is
    }
  : T
