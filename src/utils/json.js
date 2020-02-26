const validJSONstring = (s) => {
  try {
    JSON.parse(s)
    return true
  } catch (error) {
    return false
  }
}

export { validJSONstring }