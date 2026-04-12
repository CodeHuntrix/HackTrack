from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from database import engine
import models

def migrate():
    print("Starting migration...")
    with engine.connect() as conn:
        # Columns to add
        new_columns = [
            ("prize_pool", "VARCHAR"),
            ("organization", "VARCHAR"),
            ("round_1_type", "VARCHAR"),
            ("round_1_criteria", "VARCHAR"),
            ("extra_rounds", "VARCHAR"),
            ("final_round", "VARCHAR"),
        ]
        
        for col_name, col_type in new_columns:
            try:
                print(f"Adding column {col_name}...")
                conn.execute(text(f"ALTER TABLE hackathons ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Column {col_name} added.")
            except Exception as e:
                print(f"Column {col_name} probably already exists or error: {e}")
                
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
