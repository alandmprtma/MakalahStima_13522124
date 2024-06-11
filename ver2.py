import pandas as pd
import numpy as np
import itertools

# Mengambil kolom 'date' dan 'close' saja
data = pd.read_csv('test/BRIS.csv')
data = data[['date', 'close']]
data['date'] = pd.to_datetime(data['date'])
data.set_index('date', inplace=True)

# Menghitung return harian
returns = data['close'].pct_change().dropna()

# Menampilkan return harian
returns.head()


# Menghitung ekspektasi return dan risiko
mean_return = returns.mean()
risk = returns.std()

print(f"Ekspektasi Return: {mean_return}")
print(f"Risiko (Standar Deviasi): {risk}")

# Masalah Knapsack 0/1 dengan satu saham
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

# Parameter untuk algoritma Branch and Bound
value = mean_return
weight = risk
capacity = 0.1  # Contoh batas risiko yang dapat diterima

# Inisialisasi masalah Knapsack
knapsack = Knapsack(value, weight, capacity)
knapsack.branch_and_bound()

# Hasil optimasi
optimal_items = knapsack.best_items
optimal_value = knapsack.best_value

print("Saham layak dibeli:" if optimal_items[0] else "Saham tidak layak dibeli")
print("Return maksimal:", optimal_value)
