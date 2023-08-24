import { promises } from 'fs';

export async function copyFile(source: string, destination: string): Promise<void> {
  try {
    // 2. Rename the file (move it to the new directory)
    await promises.copyFile(source, destination);
  } catch (error) {
      // Throw any other error
      throw error;
  }

  // return promises.rename(source, destination)
  //   .then(() => {/* Handle success */
  //   })
  //   .catch((error) => {/* Handle failure */
  //     console.log(error);
  //   });


}
