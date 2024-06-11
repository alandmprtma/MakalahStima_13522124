import pandas as pd

def calculate_returns(file_path):
    data = pd.read_csv(file_path)
    data = data[['date', 'close']]
    data['date'] = pd.to_datetime(data['date'])
    data.set_index('date', inplace=True)
    
    returns = data['close'].pct_change().dropna()
    mean_return = returns.mean()
    risk = returns.std()
    
    return mean_return, risk

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
