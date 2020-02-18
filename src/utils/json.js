const validJSONObject = (s) => {
    try {
        JSON.parse(s);
        return true;
    } catch {
        return false;
    }
};

export {validJSONObject}