from flask import Blueprint, request, jsonify
from knapsack import calculate_returns, Knapsack

bp = Blueprint('routes', __name__)

@bp.route('/optimize', methods=['POST'])
def optimize():
    file = request.files['file']
    capacity = float(request.form['capacity'])
    
    file_path = 'temp.csv'
    file.save(file_path)
    
    mean_return, risk = calculate_returns(file_path)
    
    knapsack = Knapsack(mean_return, risk, capacity)
    knapsack.branch_and_bound()
    
    result = {
        'stock_recommendation': 'Saham layak dibeli' if knapsack.best_items[0] else 'Saham tidak layak dibeli',
        'max_return': knapsack.best_value
    }
    
    return jsonify(result)
