const toLocaleDateString = (str) => {
    // constructing locale date without comma
    // https://stackoverflow.com/questions/49982572/how-to-remove-comma-between-date-and-time-on-tolocalestring-in-js
    const dateOptions = {day: '2-digit', month: 'short'};
    const timeOptions = {hour12: true, hour: '2-digit', minute: '2-digit'};
    return new Date(str).toLocaleString('en', dateOptions) + " " + new Date(str).toLocaleString('en', timeOptions);
};

export {toLocaleDateString}