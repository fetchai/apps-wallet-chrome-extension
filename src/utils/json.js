const validJSONObject = (s) => {
    try {
        JSON.parse(s);
        return true;
    } catch (error){
        return false;
    }
};

export {validJSONObject}