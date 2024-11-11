import { isAxiosError } from "axios";

type Result<T> = [T, null] | [null, Error];

export async function to<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data.message) {
        if (Array.isArray(error.response.data.message)) error.response.data.message = error.response.data.message.join(' - ');

        return [null, error.response.data];
      }
      return [null, { message: 'Error desconocido', name: 'Error' }];
    }
    // Asegúrate de que el error es de tipo `Error`
    const err = error instanceof Error ? error : new Error(String(error));

    return [null, err];
  }
}
