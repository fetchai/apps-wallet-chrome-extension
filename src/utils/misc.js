  const handleChange = (event) =>
      {
    let change = {}
    change[event.target.name] = event.target.value
    this.setState(change)
      }

export {handleChange}