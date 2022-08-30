import axios from 'axios';
import { key } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        //`https://forkify-api.herokuapp.com/api/v2/recipes/${this.id}?key=${key}`
        `https://forkify-api.herokuapp.com/api/v2/recipes/${this.id}?key=${key}`
      );
      this.title = res.data.data.recipe.title;
      this.author = res.data.data.recipe.publisher;
      this.img = res.data.data.recipe.image_url;
      this.url = res.data.data.recipe.source_url;
      this.ingredients = res.data.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Something went wrong :(');
    }
  }

  calcTime() {
    //Assuming the we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    // const unitsLong = [
    //   'tablespoons',
    //   'tablespoon',
    //   'ounces',
    //   'ounce',
    //   'teaspoons',
    //   'teaspoon',
    //   'cups',
    //   'pounds',
    // ];
    // const unitsShort = [
    //   'tbsp',
    //   'tbsp',
    //   'oz',
    //   'oz',
    //   'tsp',
    //   'tsp',
    //   'cup',
    //   'pound',
    // ];
    // const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      // 1. Uniform Units
      // let ingredient = el.description.toLowerCase();

      // unitsLong.forEach((unit, i) => {
      //   ingredient = ingredient.replace(unit, unitsShort[i]);
      // });

      // 2. Remove parentheses
      // ingredient = ingredient.replace(/ *\([^]*\) */g, ' ');

      // 3. Parse ingredients into count, unit and ingredient
      // const arrIng = ingredient.split(' ');
      // const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      // let objIng;
      // if (el.quantity > -1) {
      //   //There is a unit
      //   //Ex. 4 1/2 cups, ArrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
      //   //Ex. 4 cups, arrCount is [4]
      //   //const arrCount = arrIng.slice(0, unitIndex);

      //   // let count;
      //   // if (arrCount.length === 1) {
      //   //   count = eval(arrIng[0].replace('-', '+'));
      //   // } else {
      //   //   count = eval(arrIng.slice(0, unitIndex).join('+'));
      //   // }

      //   // objIng = {
      //   //   count,
      //   //   unit: arrIng[unitIndex],
      //   //   ingredient: arrIng.slice(unitIndex + 1).join(' '),
      //   // };
      //   objIng = {
      //     count: el.quantity,
      //     unit: el.unit,
      //     ingredient,
      //   };
      //   // } else if (el.unit === '' && el.quantity > -1) {
      //   //   //There is NO unit but first element is a number
      //   //   objIng = {
      //   //     count: parseInt(arrIng[0], 10),
      //   //     unit: '',
      //   //     ingredient: arrIng.slice(1).join(' '),
      //   //   };
      // } else if (el.quantity === null) {
      //   //There is NO unit and NO number in 1st position
      //   objIng = {
      //     count: '',
      //     unit: '',
      //     ingredient,
      //   };
      // }

      return {
        count: el.quantity,
        unit: el.unit,
        ingredient: el.description,
      };
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    //Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    //Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
