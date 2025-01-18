module.exports = class CaptchaDto {
  data;
  text;
  constructor(model) {
    this.data = model.data;
    this.text = model.data;
  }
} 
