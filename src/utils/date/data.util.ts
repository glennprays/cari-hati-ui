export const calculateAge = (birthDate: string): number => {
    const birthDateTime: Date = new Date(birthDate);

    const currentDate: Date = new Date();

    const timeDiff: number = currentDate.getTime() - birthDateTime.getTime();

    const ageDate: Date = new Date(timeDiff);

    const age: number = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
};
