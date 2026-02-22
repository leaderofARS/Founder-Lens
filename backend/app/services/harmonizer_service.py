import os
import json
import pandas as pd
from typing import Dict, Any
from app.core.logging import get_logger
from app.models.schemas import AuditRequest

logger = get_logger(__name__)


class HarmonizerService:

    def __init__(self):
        self.raw_data_path = "research/data/raw/"

    # ===============================
    # 🔹 RAW DATA LOADERS
    # ===============================

    def _load_crunchbase_data(self) -> pd.DataFrame:
        path = os.path.join(self.raw_data_path, "crunchbase_startups.csv")
        return pd.read_csv(path)

    def _load_json_signal(self, filename: str) -> dict:
        path = os.path.join(self.raw_data_path, filename)
        with open(path, "r") as f:
            return json.load(f)

    # ===============================
    # 🔹 COMPANY-BASED FEATURE BUILDER
    # ===============================

    def build_features(self, company_name: str) -> Dict[str, Any]:
        """
        Builds model-ready feature dictionary using historical company data.
        """

        try:
            crunchbase_df = self._load_crunchbase_data()
            market_json = self._load_json_signal("market_signals.json")
            sec_json = self._load_json_signal("sec_forensics.json")
            labor_json = self._load_json_signal("bls_benchmarks.json")

            company_row = crunchbase_df[
                crunchbase_df["company_name"].str.lower() == company_name.lower()
            ]

            if company_row.empty:
                raise ValueError("Company not found in dataset")

            company_row = company_row.iloc[0]

            market_sentiment_index = market_json.get("latest_sentiment_index", 1.0)

            burn_efficiency_score = (
                company_row["total_funding_usd"] /
                labor_json.get("avg_tech_salary_usd", 100000)
            )

            sec_transparency_score = sec_json.get("transparency_score", 50)

            features = {
                "market_sentiment_index": market_sentiment_index,
                "burn_efficiency_score": burn_efficiency_score,
                "sec_transparency_score": sec_transparency_score,
                "total_funding_usd": company_row["total_funding_usd"],
                "funding_rounds": company_row["funding_rounds"],
                "founder_count": company_row.get("founder_count", 1),
                "founding_year": company_row["founding_year"]
            }

            logger.info(f"Company-based feature build successful for {company_name}")
            return features

        except Exception as e:
            logger.error(f"Company harmonization failed: {str(e)}")
            raise

    # ===============================
    # 🔹 IDEA-BASED FEATURE BUILDER
    # ===============================

    def build_features_from_input(self, data: AuditRequest) -> Dict[str, Any]:
        """
        Builds model-ready features from frontend startup idea input.
        """

        try:
            # 1️⃣ Burn Efficiency
            burn_efficiency_score = data.monthlyBurn / max(data.targetCAC, 1)

            # Normalize to 0–1 scale
            burn_efficiency_score = min(burn_efficiency_score / 100, 1.0)

            # 2️⃣ Assumption Risk
            assumption_count = len(data.assumptions)
            assumption_risk_score = min(assumption_count * 0.1, 1.0)

            # 3️⃣ Pitch Complexity
            pitch_word_count = len(data.elevatorPitch.split())
            pitch_complexity_score = min(pitch_word_count / 100, 1.0)

            # 4️⃣ Basic runway approximation
            estimated_runway_score = min((data.targetCAC / max(data.monthlyBurn, 1)), 1.0)

            features = {
                "burn_efficiency_score": burn_efficiency_score,
                "assumption_risk_score": assumption_risk_score,
                "pitch_complexity_score": pitch_complexity_score,
                "estimated_runway_score": estimated_runway_score
            }

            logger.info("Idea-based feature build successful.")
            return features

        except Exception as e:
            logger.error(f"Input harmonization failed: {str(e)}")
            raise