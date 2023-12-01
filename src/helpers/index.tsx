export const diffMinutes = (dt2:any, dt1:any) => {
  const diffInMinutes = (dt2.getTime() - dt1.getTime()) / 1000 / 60;
  return Math.ceil(diffInMinutes);
};

export const getDateByTimeZone = (timeZone:any) => {
    

    const currentDate = new Intl.DateTimeFormat('es-ES',{timeZone}).formatToParts(
        new Date(),
    );

    const year = currentDate[4].value;
    const month = currentDate[2].value;
    const day = currentDate[0].value;
    const hour = currentDate[6].value;
    const minute = currentDate[8].value;

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00.000Z`);
};

const setHours = (currentDate:any, hour:number) => {
    return new Date(`${currentDate.toISOString().split('T')[0]}T${hour}.000Z`);
};
