📊 Maternal & Child Health Dashboard

A data-driven interactive dashboard built using Python, Streamlit, and Plotly to visualize key Maternal & Child Health indicators from the NFHS-5 (2019–21) and NFHS-4 (2015–16) surveys.

👉 Live Demo: 👉 **Live Demo:** [Streamlit App](https://maternal-child-health-dashboard-4appugn5fq9hjg4jzmlkwhk.streamlit.app/)
⸻

✨ Features

- Interactive bar charts (urban, rural, total values).
- Statewise bubble map of India.
- Quick insights: **Top & Bottom 3 states** for each indicator.
- Change insights: **NFHS-4 → NFHS-5 progress**.
- Downloadable CSV comparison tables.
- Clean, mobile-friendly Streamlit app.
 
⸻

📸 Screenshots
### Dashboard Home  
![Dashboard Screenshot](https://github.com/user-attachments/assets/0f95c674-1a53-4956-a6dd-231b2bfc0d2e)  

### Interactive Bar Chart  
![Bar Chart Screenshot](https://github.com/user-attachments/assets/a8ab748d-12d2-4b6f-9aca-867cb1091c5e)  

### India Bubble Map  
![Map Screenshot](https://github.com/user-attachments/assets/a70201db-091b-450f-ad23-0685ccc5792a)  
⸻

🛠️ Tech Stack

	•	Python 3.9+
	•	Streamlit (dashboard framework)
	•	Plotly Express (interactive charts)
	•	Pandas (data handling & cleaning)
	•	GeoJSON / Mapping (for Indian states)

⸻

📊 Dataset

	•	Source: National Family Health Survey (NFHS-5, 2019–21; NFHS-4, 2015–16)
	•	Process: Cleaned and structured for state-level indicator comparisons
	•	Format: CSV hosted in /data/ folder

⸻

## 🔍 Insights

- **Current NFHS-5 snapshot**: Kerala, Mizoram, and Goa consistently perform among the top states, while Bihar, Uttar Pradesh, and Jharkhand lag behind.  
- **Change since NFHS-4**: Significant improvements observed in Odisha and Chhattisgarh, while some states show declines that require policy attention.  
- **Policy relevance**: These insights align with **SDG-3 (Good Health & Well-Being)** and **SDG-5 (Gender Equality)**.

⸻

🚀 How to Run Locally

# Clone repository
git clone https://github.com/sameekshajangra/Maternal-Child-Health-Dashboard.git
cd Maternal-Child-Health-Dashboard

# Install dependencies
pip install -r requirements.txt

# Run Streamlit app
streamlit run app.py


⸻

🌍 Motivation & Relevance

This project was created to make maternal and child health data easy to understand and use. By turning survey numbers into interactive visuals, it highlights gaps, progress, and state-wise differences. The goal is to support better awareness, planning, and decisions that improve the lives of women and children.
