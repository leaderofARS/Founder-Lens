import requests
import json
import os
import time
from dotenv import load_dotenv

# Pathing logic
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(base_dir, "..", "backend", ".env"))

class DataHarvester:
    def __init__(self):
        self.alpha_key = os.getenv("ALPHA_VANTAGE_KEY")
        self.sec_token = os.getenv("SEC_API_TOKEN")
        self.bls_key = os.getenv("BLS_API_KEY")
        
        self.signal_path = os.path.join(base_dir, "data", "signals")
        os.makedirs(self.signal_path, exist_ok=True)
        print(f"Signals directory verified: {self.signal_path}")

    def fetch_market_momentum(self, symbol="QQQ"):
        """Gets tech sector momentum from Alpha Vantage (using QQQ ETF as proxy)"""
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={self.alpha_key}'
        
        print(f"📡 Requesting Alpha Vantage for {symbol}...")
        r = requests.get(url)
        data = r.json()

        if "Note" in data:
            print(f"Rate limit hit: {data['Note']}")
            return None
        
        if "Global Quote" in data and data["Global Quote"]:
            with open(os.path.join(self.signal_path, "market_momentum.json"), "w") as f:
                json.dump(data, f, indent=4)
            print(f"💾 Saved: market_momentum.json ({symbol})")
            return data
        else:
            print(f"No data for {symbol}. Response: {data}")
            return None

    def fetch_labor_benchmarks(self):
        """Fetches CPI and Software Dev salary trends from BLS"""
        print("📡 Requesting BLS for labor benchmarks...")
        # Series IDs: CUUR0000SA0 (CPI), OEUM000000015125211 (Software Devs)
        headers = {'Content-type': 'application/json'}
        data = json.dumps({
            "seriesid": ['CUUR0000SA0', 'OEUM000000015125211'],
            "startyear": "2024", 
            "endyear": "2026",
            "registrationkey": self.bls_key
        })
        
        try:
            p = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers)
            json_data = p.json()
            
            with open(os.path.join(self.signal_path, "labor_benchmarks.json"), "w") as f:
                json.dump(json_data, f, indent=4)
            print("💾 Saved: labor_benchmarks.json")
            return json_data
        except Exception as e:
            print(f"BLS API Error: {e}")
            return None

    def fetch_sec_benchmark(self, ticker="UBER"):
        """Monitors SEC usage and saves a placeholder benchmark"""
        url = f"https://api.sec-api.io/api-key-usage?token={self.sec_token}&date=2026-02"
        try:
            usage = requests.get(url).json()
            print(f"SEC API Usage: {usage.get('monthlyBandwidthUsedInMb', 0)} MB")
            
            benchmark = {"ticker": ticker, "logic": "Forensic Historical Baseline"}
            with open(os.path.join(self.signal_path, f"sec_benchmark_{ticker}.json"), "w") as f:
                json.dump(benchmark, f, indent=4)
            print(f"Saved: sec_benchmark_{ticker}.json")
        except Exception as e:
            print(f"SEC API Error: {e}")

if __name__ == "__main__":
    harvester = DataHarvester()
    
    # 1. Market (Using QQQ for reliable tech tracking)
    harvester.fetch_market_momentum("QQQ")
    
    time.sleep(2) # Avoid rate limit
    
    # 2. Labor (Operational Truth)
    harvester.fetch_labor_benchmarks()
    
    time.sleep(2)
    
    # 3. SEC (Past Truth)
    harvester.fetch_sec_benchmark("UBER")
    
    print("\nAll signals acquired successfully.")