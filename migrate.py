import pandas as pd
import sqlite3
import os
import re

file_real = 'data/my_real_portfolio.xlsx'
file_mock = 'data/mock_data.xlsx'


# Check and read the Excel file :D

if os.path.exists(file_real):
    df = pd.read_excel(file_real)
    print("System: Using your real data...")
else:
    df = pd.read_excel(file_mock)
    print("System: No real data found, using mock data...")

# Select columns A-J
df = df.iloc[:, 0:10]
# Rename columns for database
df.columns = [
    'date', 'time', 'symbol', 'action', 'target_price', 
    'actual_value', 'quantity', 'fee', 'profit_loss', 'note'
]

# Janitor Simulator :P
def clean_currency_with_negative(value):
    if isinstance(value, str):
        is_negative = '-' in value
        clean_val = re.sub(r'[^\d.]', '', value)
        if clean_val:
            num = float(clean_val)
            return -num if is_negative else num
        return 0.0
    return value

df = df.drop(columns=['fee'])
columns_to_clean = ['target_price', 'actual_value', 'profit_loss']
for col in columns_to_clean:
    df[col] = df[col].apply(clean_currency_with_negative)

# 4. Convert Buddhist year to Christian year
def convert_buddhist_year(date_val):
    if pd.api.types.is_datetime64_any_dtype(date_val) or hasattr(date_val, 'year'):
        if date_val.year > 2500:
            return date_val.replace(year=date_val.year - 543)
        return date_val
    if isinstance(date_val, str) and '-' in date_val:
        parts = date_val.split('-')
        if int(parts[0]) > 2500:
            year = int(parts[0]) - 543
            return f"{year}-{parts[1]}-{parts[2]}"
    return date_val

df['date'] = df['date'].apply(convert_buddhist_year)
df['date'] = pd.to_datetime(df['date'])

# 5. Create ID column (Doesn't have in Excel) and separate Buy or Sell
df.insert(0, 'id', range(1, 1 + len(df)))

# Separate Buy or Sell
df['action'] = df['action'].map({'ซื้อ': 'BUY', 'ขาย': 'SELL'}).fillna('UNKNOWN')
for col in ['quantity', 'actual_value']:
    df[col] = df[col].apply(lambda x: abs(float(x)) if pd.notnull(x) else 0)
    df.loc[df['action'] == 'SELL', col] *= -1

# 6. Insert into SQLite
with sqlite3.connect('portfolio.db') as conn:
    cursor = conn.cursor()
    
    # Create AUTOINCREMENT ID
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            time TEXT,
            symbol TEXT,
            action TEXT,
            target_price REAL,
            actual_value REAL,
            quantity REAL,
            profit_loss REAL,
            note TEXT
        )
    ''')
    
    # Prepare data: Remove id column from df (if any) because we will let SQL generate it
    if 'id' in df.columns:
        df_to_save = df.drop(columns=['id'])
    else:
        df_to_save = df

    # Insert data
    df_to_save.to_sql('transactions', conn, if_exists='append', index=False)

print("✅ Migration Completed! ข้อมูลสะอาดกริ๊บพร้อมใช้งานแล้วคั้บ เริ่ดด")