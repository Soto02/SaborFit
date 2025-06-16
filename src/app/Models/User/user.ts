export class User {
  //VARIABLES
  private id: number = 0;
  private name: string = '';
  private email: string = '';
  private password: string = '';
  private login?: boolean = false;

  //CONSTRUCTOR
  constructor(name: string, email: string, password: string, id?: number) {
    this.name = name;
    this.email = email;
    this.password = password;
    if(id) this.id = id;
  }

  //METODOS GET
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }
  public getLogin(): boolean {
    if (this.login) {
      return this.login;
    } else {
      return false;
    }
  }

  //MOTODOS SET
  public setName(name: string) {
    this.name = name;
  }
  public setEmail(email: string) {
    this.email = email;
  }
  public setPassword(password: string) {
    this.password = password;
  }
  public setLogin(login: boolean) {
    this.login = true;
  }
  public setLogout(login: boolean) {
    this.login = false;
  }
}
