from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from datetime import datetime
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Ini akan mengizinkan semua asal. Sesuaikan sesuai kebutuhan Anda.

# Ensure the 'uploads' folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class Knapsack:
    def __init__(self, value, weight, capacity):
        self.value = value
        self.weight = weight
        self.capacity = capacity
        self.best_value = 0
        self.best_items = []

    def bound(self, current_value, current_weight):
        if current_weight >= self.capacity:
            return 0
        return current_value if current_weight <= self.capacity else 0

    def branch_and_bound(self):
        current_value = 0
        current_weight = 0
        if current_weight + self.weight <= self.capacity:
            self.best_value = self.value
            self.best_items = [1]  # Saham layak dibeli
        else:
            self.best_value = 0
            self.best_items = [0]  # Saham tidak layak dibeli

@app.route('/api/optimize', methods=['POST'])
def optimize():
    if 'file' not in request.files or 'capacity' not in request.form:
        return jsonify({"error": "File atau kapasitas tidak ditemukan"}), 400

    file = request.files['file']
    capacity = request.form['capacity']

    # Save the file to the uploads folder
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'data.csv')
    file.save(file_path)

    try:
        data = pd.read_csv(file_path)
        data = data[['date', 'close']]
        data['date'] = pd.to_datetime(data['date'])
        data.set_index('date', inplace=True)

        returns = data['close'].pct_change().dropna()

        mean_return = returns.mean()
        risk = returns.std()

        value = mean_return
        weight = risk

        if capacity == "Moderat":
            capacity = 0.05
        elif capacity == "Konservatif":
            capacity = 0.1
        elif capacity == "Agresif":
            capacity = 0.2

        knapsack = Knapsack(value, weight, capacity)
        knapsack.branch_and_bound()

        optimal_items = knapsack.best_items
        optimal_value = knapsack.best_value

        return jsonify({
            "stock_recommendation": "Saham layak dibeli" if optimal_items[0] else "Saham tidak layak dibeli",
            "max_return": optimal_value,
            "risk": risk  # Tambahkan risiko dalam respons JSON
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
