import requests
import json
import os
import time
import random
from datetime import datetime
from dotenv import load_dotenv

# Pathing logic to locate the .env in the backend directory
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(dotenv_path=os.path.join(base_dir, "..", "backend", ".env"))

class DataHarvester:
    def __init__(self):
        self.alpha_key = os.getenv("ALPHA_VANTAGE_KEY")
        self.sec_token = os.getenv("SEC_API_TOKEN")
        self.bls_key = os.getenv("BLS_API_KEY")
        
        # Ensure signals directory exists within the research data folder
        self.signal_path = os.path.join(base_dir, "data", "signals")
        os.makedirs(self.signal_path, exist_ok=True)
        print(f"Harvester Initialized. Signals path: {self.signal_path}")

    def _append_json(self, filename, new_data, metadata=None):
        """Helper to append new data points to a list in a JSON file to build history."""
        filepath = os.path.join(self.signal_path, filename)
        
        entry = {
            "captured_at": datetime.now().isoformat(),
            "simulation_metadata": metadata,
            "data": new_data
        }

        current_data = []
        if os.path.exists(filepath):
            with open(filepath, "r") as f:
                try:
                    current_data = json.load(f)
                    if not isinstance(current_data, list):
                        current_data = [current_data]
                except json.JSONDecodeError:
                    current_data = []
        
        current_data.append(entry)
        
        with open(filepath, "w") as f:
            json.dump(current_data, f, indent=4)
        print(f"Data point appended to {filename}")

    # --- PILLAR 1: RANDOMIZED MARKET HISTORY (Alpha Vantage) ---
    def fetch_random_historical_market(self, symbol="QQQ"):
        """Fetches 20-year history and picks a random day to avoid static weekend data."""
        print(f"Alpha Vantage: Fetching full history for {symbol} to sample random conditions...")
        # outputsize=full ensures we get the maximum historical depth
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={self.alpha_key}'
        
        try:
            r = requests.get(url)
            data = r.json()
            
            if "Time Series (Daily)" in data:
                series = data["Time Series (Daily)"]
                all_dates = list(series.keys())
                random_date = random.choice(all_dates)
                random_day_data = series[random_date]
                
                meta = {"source_date": random_date, "type": "historical_random_sample"}
                self._append_json("market_momentum.json", random_day_data, meta)
                return random_day_data
            print(f"Alpha Vantage: Error or limit hit. Response keys: {data.keys()}")
        except Exception as e:
            print(f"Alpha Vantage Error: {e}")
        return None

    # --- PILLAR 2: RANDOMIZED LABOR DATA (BLS) ---
    def fetch_random_labor_benchmarks(self):
        """Fetches 10-year window and picks a random month for simulation diversity."""
        print("BLS: Fetching 2015-2025 window to sample random labor costs...")
        headers = {'Content-type': 'application/json'}
        payload = json.dumps({
            "seriesid": ['CUUR0000SA0'], # CPI - All Items
            "startyear": "2015",
            "endyear": "2025",
            "registrationkey": self.bls_key
        })
        
        try:
            r = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=payload, headers=headers)
            res = r.json()
            
            if res.get("status") == "REQUEST_SUCCEEDED":
                series_data = res['Results']['series'][0]['data']
                random_period = random.choice(series_data)
                
                meta = {"source_period": f"{random_period['year']}-{random_period['period']}"}
                self._append_json("labor_benchmarks.json", random_period, meta)
                return random_period
            print(f"BLS: Request failed with message: {res.get('message')}")
        except Exception as e:
            print(f"BLS Error: {e}")
        return None

    # --- PILLAR 3: SEC FORENSICS (SEC-API) ---
    def fetch_sec_forensics(self, ticker="MSFT"):
        """Uses direct CIK search (Microsoft: 789019) for 100% reliability and Item 1A extraction."""
        print(f"SEC: Searching for filings for CIK: 789019 ({ticker})...")
        
        query_url = f"https://api.sec-api.io?token={self.sec_token}"
        # Direct CIK query is more stable than ticker queries on weekends
        query_payload = {
            "query": "cik:789019 AND formType:\"10-K\"",
            "from": "0", "size": "1",
            "sort": [{"filedAt": {"order": "desc"}}]
        }
        
        try:
            res = requests.post(query_url, json=query_payload).json()
            if res.get("filings"):
                f_url = res["filings"][0]["linkToFilingHtml"]
                print(f"SEC: Extracting Item 1A from {f_url}")
                
                # Extractor API call for Item 1A (Risk Factors)
                extract_url = f"https://api.sec-api.io/extractor?url={f_url}&item=1A&type=text&token={self.sec_token}"
                section_text = requests.get(extract_url).text
                
                forensic_data = {
                    "ticker": ticker.upper(),
                    "risk_factors_preview": section_text[:500] + "...",
                    "filed_at": res["filings"][0]["filedAt"],
                    "source": f_url
                }
                self._append_json(f"sec_forensics_{ticker.upper()}.json", forensic_data)
                return forensic_data
            else:
                print(f"SEC: No filings found for CIK 789019.")
        except Exception as e:
            print(f"SEC Forensic Error: {e}")
        return None

if __name__ == "__main__":
    hv = DataHarvester()
    
    # Run simulation sequence
    hv.fetch_random_historical_market("QQQ")
    time.sleep(2) # Delay to respect free-tier rate limits
    
    hv.fetch_random_labor_benchmarks()
    time.sleep(2)
    
    hv.fetch_sec_forensics("MSFT")
    
    print("Harvester task complete. Historical data points have been appended to signals.")