module.exports = class UserDto {
  email;
  id;
  name;

  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.name = model.name;
  }
} 
