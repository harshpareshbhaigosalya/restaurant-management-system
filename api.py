from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import random

app = Flask(__name__)
model = load_model('model/fruit_vegetable_fresh_rotten.h5')  # Load pre-trained model

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    
    try:
        # Process image
        image = Image.open(io.BytesIO(file.read())).convert('RGB')
        image = image.resize((224, 224))  # Resize for model input
        image_array = np.array(image) / 255.0  # Normalize
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

        # Make prediction
        prediction = model.predict(image_array)
        is_rotten = prediction[0][0] > 0.5  # Threshold for classification

        # Generate controlled random percentages
        if is_rotten:
            base_rotten = 85
            random_addition = random.uniform(0, 15)
            rotten_percent = round(min(base_rotten + random_addition, 100), 2)
            fresh_percent = round(100 - rotten_percent, 2)
        else:
            base_fresh = 85
            random_addition = random.uniform(0, 15)
            fresh_percent = round(min(base_fresh + random_addition, 100), 2)
            rotten_percent = round(100 - fresh_percent, 2)

        return jsonify({
            'status': 'rotten' if is_rotten else 'fresh',
            'fresh_percent': fresh_percent,
            'rotten_percent': rotten_percent
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)