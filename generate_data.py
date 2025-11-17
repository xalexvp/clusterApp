import json
import random
import sys

def generate_geojson(num_points):
    features = []
    min_lon, max_lon = 22.1, 40.2
    min_lat, max_lat = 44.4, 52.4

    minerals = ["Залізна руда", "Вугілля", "Літій", "Уран", "Титан", "Нафта", "Газ", "Золото", "Мідь", "Сіль", "Граніт", "Торф"]
    regions = ["Київська", "Львівська", "Донецька", "Дніпропетровська", "Харківська", "Одеська", "Кіровоградська", "Житомирська", "Запорізька", "Полтавська", "Волинська", "Луганська"]
    statuses = ["експлуатується", "розвідується", "законсервовано", "планується", "ліквідовано"]

    for i in range(num_points):
        lon = random.uniform(min_lon, max_lon)
        lat = random.uniform(min_lat, max_lat)

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            },
            "properties": {
                "id": f"dep_{i+1:05d}",
                "name": f"Тестове родовище #{i+1}",
                "mineral": random.choice(minerals),
                "region": random.choice(regions),
                "status": random.choice(statuses),
                "value_usd_mil": round(random.uniform(0.1, 500.0), 2)
            }
        }
        features.append(feature)

    feature_collection = {
        "type": "FeatureCollection",
        "features": features
    }

    return feature_collection

# Кількість точок для генерації (можна змінити на 100000, якщо потрібно більше)
NUM_POINTS_TO_GENERATE = 1000000

# Генеруємо дані
geojson_data = generate_geojson(NUM_POINTS_TO_GENERATE)

# Записуємо дані у файл
try:
    with open("large_deposits.geojson", "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, ensure_ascii=False, indent=2)
    print(f"Згенеровано {NUM_POINTS_TO_GENERATE} точок у файл large_deposits.geojson")
except IOError as e:
    print(f"Помилка при записі файлу: {e}")
    sys.exit(1)

