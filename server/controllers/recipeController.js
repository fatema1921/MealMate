const axios = require('axios'); 
const Recipe = require('../models/recipe');
const { response } = require('express');

// Search recipie in the external database 
exports.searchRecipie = async (req, res) => {
    const recipie = req.params.recipie; 
    const mealDB = `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipie}`;
    
    try {
       const response = await axios.getAdapter(mealDB); 
       const meal = response.data.meal; 

       if(!meal){
        return res.status(404).json ({"message": "Recepie not found"}); 
       }
       res.json(meal);
    } catch (error){
        next (error); 
    }
}; 

// Create recipie 
