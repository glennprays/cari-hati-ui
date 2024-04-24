export const calculateAge = (birthDate: string): number => {
    const birthDateTime: Date = new Date(birthDate);

    const currentDate: Date = new Date();

    const timeDiff: number = currentDate.getTime() - birthDateTime.getTime();

    const ageDate: Date = new Date(timeDiff);

    const age: number = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
    ); // Convert to local time
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); 
    const year = localDate.getFullYear();

    return `${day}/${month}/${year}`;
};
