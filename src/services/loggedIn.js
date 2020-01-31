const isLoggedIn = () => {
       const logged_in = localStorage.getItem('logged_in');
       return Boolean(JSON.parse(logged_in))
    }

    const logOut = () => {
    localStorage.setItem('logged_in', "false");
    }

export { isLoggedIn, logOut }