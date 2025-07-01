export function handleError(error: any) {
  console.error(`Error: ${JSON.stringify(error, null, 3)}, ${error}`);
}
