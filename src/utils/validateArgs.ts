import * as yup from "yup";

interface ValidationError {
  path: string;
  message: string;
}

export const validateArgs = async (
  schema: yup.ObjectSchema,
  args: Object
): Promise<ValidationError[]> => {
  try {
    await schema.validate(args, { abortEarly: false });
  } catch (err) {
    return err.inner.map(({ path, message }: ValidationError) => ({
      name: path,
      message,
    }));
  }

  return [];
};
