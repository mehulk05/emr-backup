export const filterElementFromKey = (
  array: any[],
  values: any[],
  key: string | number
) => {
  // Check if both array and values have length greater than 0 and are not null
  if (
    !Array.isArray(array) ||
    array.length === 0 ||
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return values; // Return the values array directly if any of the conditions are not met
  }

  const filteredArray = array.filter((element) =>
    values.includes(element[key])
  );

  // Use map to extract the specified property from each object in filteredArray
  const resultValues = filteredArray.map((element) => element[key]);

  return resultValues;

  return filteredArray;
};
