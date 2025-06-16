export class Recipe {
  //VARIABLES
  private id: number = 0;
  private name: string = '';
  private ingredients: string[] = [''];
  private instructions: string[] = [''];
  private description: string = '';
  private thumbnail: string = '';
  private favorite: boolean = false;

  //CONSTRUCTOR
  constructor(
    id: number,
    name: string,
    ingredients: string[],
    description: string,
    thumbnail: string,
    favorite: boolean,
    instructions: string[]
  ) {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.description = description;
    this.thumbnail = thumbnail;
    this.favorite = favorite;
    this.instructions = instructions;
  }

  //METODOS GET
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getIngredients(): string[] {
    return this.ingredients;
  }
  public getInstructions(): string[] {
    return this.instructions;
  }
  public getDescription(): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = this.description;
    return tmp.textContent || tmp.innerText || '';
  }
  public getThumbnail(): string {
    return this.thumbnail;
  }
  public getFavorite(): boolean {
    return this.favorite;
  }

  //METODOS SET
  public setId(id: number) {
    this.id = id;
  }
  public setName(name: string) {
    this.name = name;
  }
  public setIngredients(ingredients: string[]) {
    this.ingredients = ingredients;
  }
  public setInstructions(instructions: string[]) {
    this.instructions = instructions;
  }
  public setDescription(description: string) {
    this.description = description;
  }
  public setThumbnail(thumbnail: string) {
    this.thumbnail = thumbnail;
  }
  public setFavorite(favorite: boolean) {
    this.favorite = favorite;
  }
}
