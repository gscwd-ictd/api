export const getDayRange1stHalf = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
};

export const getDayRange2ndHalf = (numberOfDays: number) => {
  switch (numberOfDays) {
    case 28:
      return [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    case 29:
      return [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    case 30:
      return [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    case 31:
      return [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    default:
      return [9, 31];
  }
};
