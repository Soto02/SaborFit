export class User {

    //VARIABLES
    private id : number = 0
    private name : string = "";
    private email : string = "";
    private password : string = "";
    private login : boolean = false;

    //CONSTRUCTOR
    constructor(name : string, email : string, password : string, login : boolean) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.login = login;
    }

    //METODOS GET
    public getName() : string {
        return this.name;
    }
    public getEmail() : string {
        return this.email;
    }
    public getPassword() : string {
        return this.password;
    }
    public getLogin() : boolean {
        return this.login;
    }

    //MOTODOS SET
    public setName(name : string) {
        this.name = name;
    }
    public setEmail(email : string) {
        this.email = email;
    }
    public setPassword(password : string) {
        this.password = password;
    }
    public setLogin(login : boolean) {
        this.login = true;
    }
    public setLogout(login : boolean) {
        this.login = false;
    }
    


    
    
    
    
}
