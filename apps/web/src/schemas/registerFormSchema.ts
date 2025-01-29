import * as Yup from 'yup'

const registerFormSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required').min(3, 'First Name must be at least 3 characters').max(15, 'First Name must be at most 15 characters').matches(/^[A-Za-z]+$/, 'First Name must contain only letters'),
  lastName: Yup.string().required('Last Name is required').min(3, 'First Name must be at least 3 characters').max(15, 'First Name must be at most 15 characters').matches(/^[A-Za-z]+$/, 'Last Name must contain only letters'),
  age: Yup.number()
    .required('Age is required')
    .positive('Age must be a positive number')
    .min(3, 'You must be at least 3 years old')
    .max(80, 'Age must be at most 80 years old')
    .integer('Age must be a valid number'),
})

export default registerFormSchema
