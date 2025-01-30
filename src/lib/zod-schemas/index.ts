import {z} from 'zod'

export const emailValidSchema = z
  .string()
  .email({message: 'Please enter a valid email address.'})

export const passwordValidSchema = z
  .string()
  .min(6, {message: 'Password must be at least 6 characters long.'})
//TODO- uncomment the regex on production
// .regex(
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//   {
//     message:
//       'Password must include at least one uppercase letter, one lowercase letter, and one number.',
//   }
// );
/**
 * @matches-like:
 * 1. https://maps.app.goo.gl/MDCSdpK5yDCRog9aA
 *
 * 2. ```<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28655.95525535222!2d91.79656279999999!3d26.131725349999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1737838975062!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>```
 * */
export const googleMapsSchema = z
  .string()
  .refine((url) => {
    const regex =
      /^(https:\/\/maps\.app\.goo\.gl\/[A-Za-z0-9]+)$|^(<iframe\s+src="https:\/\/www\.google\.com\/maps\/embed\?.*?"[^>]*><\/iframe>)$/;
    return regex.test(url);
  }, {
    message: "Invalid Google Maps URL or embed iframe.",
  });