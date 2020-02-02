
export default class Authentication {

    static isLoggedIn() {
       const logged_in = localStorage.getItem('logged_in');
       return Boolean(JSON.parse(logged_in))
}

static logOut() {
    localStorage.setItem('logged_in', "false");
    }



}



export { Authentication }