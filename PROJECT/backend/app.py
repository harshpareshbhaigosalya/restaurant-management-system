from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import google.generativeai as genai
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["restaurantDB"]  # Database Name
menu_collection = db["menu_item"]  # Menu Collection
inventory_col = db["inventory"]  # Inventory Collection
recipes_col = db["recipes"]  # Recipes Collection
ai_recipe_collection = db["recipes"]  # Your collection name

# Google AI Configuration
api_key = os.getenv("GOOGLE_AI_KEY")
if not api_key:
    raise ValueError("GOOGLE_AI_KEY not found in environment variables")
genai.configure(api_key=api_key)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API is working!"})

# ================== Inventory Management ==================

@app.route("/add_product", methods=["POST"])
def add_product():
    data = request.json
    if not data or "pro_name" not in data:
        return jsonify({"error": "Invalid data"}), 400

    existing_product = inventory_col.find_one({"pro_name": data["pro_name"]})
    if existing_product:
        new_quantity = int(existing_product["pro_quant"]) + int(data["pro_quant"])
        inventory_col.update_one(
            {"_id": existing_product["_id"]},
            {"$set": {"pro_quant": new_quantity, "pro_price": data["pro_price"]}}
        )
        return jsonify({"message": "Product quantity updated successfully!"}), 200
    else:
        inserted_product = inventory_col.insert_one(data)
        return jsonify({"message": "Product added successfully!", "product_id": str(inserted_product.inserted_id)}), 201

@app.route("/get_products", methods=["GET"])
def get_products():
    products = list(inventory_col.find({}))
    for product in products:
        product["_id"] = str(product["_id"])
    return jsonify(products), 200

@app.route("/update_product/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    result = inventory_col.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": data}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Product not found!"}), 404
    return jsonify({"message": "Product updated successfully!"})

@app.route("/delete_product/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    result = inventory_col.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found!"}), 404
    return jsonify({"message": "Product deleted successfully!"})

# ================== Menu Management ==================

@app.route("/get_menu", methods=["GET"])
def get_menu():
    try:
        menu = list(menu_collection.find({}, {"_id": 1, "name": 1, "price": 1}))
        for item in menu:
            item["_id"] = str(item["_id"])
        return jsonify(menu)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/add_dish", methods=["POST"])
def add_dish():
    try:
        data = request.json
        if menu_collection.find_one({"name": data["name"]}):
            return jsonify({"error": "Dish already exists!"}), 400
        
        inserted_dish = menu_collection.insert_one({
            "name": data["name"],
            "price": data["price"]
        })
        return jsonify({"message": "Dish added successfully!", "dish_id": str(inserted_dish.inserted_id)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/update_dish/<dish_id>", methods=["PUT"])
def update_dish(dish_id):
    try:
        data = request.json
        result = menu_collection.update_one(
            {"_id": ObjectId(dish_id)},
            {"$set": {"name": data["name"], "price": data["price"]}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Dish not found!"}), 404
        return jsonify({"message": "Dish updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/delete_dish/<dish_id>", methods=["DELETE"])
def delete_dish(dish_id):
    try:
        result = menu_collection.delete_one({"_id": ObjectId(dish_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Dish not found!"}), 404
        return jsonify({"message": "Dish deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_ai_menu', methods=['GET'])
def get_ai_menu():
    ai_recipes = list(ai_recipe_collection.find({}, {"_id": 0}))  # Ensure this is correct
    return jsonify(ai_recipes)




# ================== AI Recipe Generation ==================

@app.route("/generate-recipe", methods=["POST"])
def generate_recipe():
    try:
        data = request.json
        if not data or "ingredients" not in data or "categories" not in data:
            return jsonify({"error": "Missing ingredients or categories"}), 400

        ingredients = data["ingredients"]
        categories = ", ".join(data["categories"])

        ingredient_details = [f"{ing} - Price TBD" for ing in ingredients]
        prompt = (
            f"Generate a dish using the following ingredients: {', '.join(ingredient_details)}. "
            f"It should be {categories}-style. Divide the response into sections: "
            f"1. Give Proper All dishes possible names only first , 2. Ingredients and recipe, 3. Cooking Instructions, "
            f"4. Price Estimation of the all ingredients in INR, "
            f"5. Total Cost, "
            f"6. Tips to Reduce Food Waste (include heating instructions, storage tips, etc.). highlight this section"
        )

        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)

        recipe = response.text if hasattr(response, "text") else "Failed to parse recipe"
        recipes_col.insert_one({"recipe": recipe, "ingredients": ingredients, "categories": data["categories"]})

        return jsonify({"recipe": recipe})
    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
