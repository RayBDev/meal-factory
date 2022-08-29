import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    try {
      const res = await axios(
        // `https://forkify-api.herokuapp.com/api/v2/recipes?search=${
        //   this.query
        // }&key=${key}`
        `${proxy}https://food2fork.ca/api/recipe/search/?query=${this.query}`,
        {
          headers: {
            Authorization: 'Token 9c8b06d329136da358c2d00e76946b0111ce2c48',
          },
        }
      );
      this.result = res.data.results;
      console.log(res);
    } catch (error) {
      alert(error);
    }
  }
}
