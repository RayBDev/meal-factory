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
        `https://food2fork.ca/api/recipe/get/?id=${this.id}`,
        {
          headers: {
            Authorization: 'Token 9c8b06d329136da358c2d00e76946b0111ce2c48',
          },
        }
      );
      this.title = res.data.title;
      this.author = res.data.publisher;
      this.img = res.data.features_image;
      this.url = res.data.source_url;
      this.ingredients = res.data.ingredients;
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
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      console.log(el);
      // 1. Uniform Units
      let ingredient = el.toLowerCase();
      console.log(ingredient);
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      console.log('step1');
      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^]*\) */g, ' ');
      console.log('step2');
      // 3. Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //There is a unit
        //Ex. 4 1/2 cups, ArrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
        //Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is NO unit but first element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        //There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      console.log(objIng);
      return objIng;
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
