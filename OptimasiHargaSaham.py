import pandas as pd
import numpy as np
import itertools

# Membaca data dari file CSV
data = pd.read_csv('harga_saham.csv', parse_dates=['Tanggal'], index_col='Tanggal')

# Menghitung return harian
returns = data.pct_change().dropna()

# Menghitung ekspektasi return dan variansi (risiko) dari setiap saham
mean_returns = returns.mean()
risks = returns.std()

# Masalah Knapsack 0/1
class Knapsack:
    def __init__(self, values, weights, capacity):
        self.values = values
        self.weights = weights
        self.capacity = capacity
        self.n = len(values)
        self.best_value = 0
        self.best_items = []

    def bound(self, i, current_value, current_weight):
        if current_weight >= self.capacity:
            return 0
        bound_value = current_value
        total_weight = current_weight
        for j in range(i, self.n):
            if total_weight + self.weights[j] <= self.capacity:
                total_weight += self.weights[j]
                bound_value += self.values[j]
            else:
                bound_value += (self.capacity - total_weight) * self.values[j] / self.weights[j]
                break
        return bound_value

    def branch_and_bound(self, i=0, current_value=0, current_weight=0, current_items=[]):
        if i == self.n:
            if current_value > self.best_value:
                self.best_value = current_value
                self.best_items = current_items
            return
        if current_weight + self.weights[i] <= self.capacity:
            self.branch_and_bound(i + 1, current_value + self.values[i], current_weight + self.weights[i], current_items + [i])
        if self.bound(i + 1, current_value, current_weight) >= self.best_value:
            self.branch_and_bound(i + 1, current_value, current_weight, current_items)

# Data ekspektasi return sebagai nilai dan variansi sebagai risiko
values = mean_returns.values
weights = risks.values
capacity = 0.5  # Batas risiko yang dapat diterima

# Inisialisasi masalah Knapsack
knapsack = Knapsack(values, weights, capacity)
knapsack.branch_and_bound()

# Hasil optimasi
optimal_items = knapsack.best_items
optimal_value = knapsack.best_value

print("Saham yang dipilih:", optimal_items)
print("Return maksimal:", optimal_value)
