📊 Maternal & Child Health Dashboard

A data-driven interactive dashboard built using Python, Streamlit, and Plotly to visualize key Maternal & Child Health indicators from the NFHS-5 (2019–21) and NFHS-4 (2015–16) surveys.

👉 Live Demo: 👉 **Live Demo:** [Streamlit App](https://maternal-child-health-dashboard-4appugn5fq9hjg4jzmlkwhk.streamlit.app/)
⸻

✨ Features
	•	📂 Dataset Preview – Cleaned NFHS-5 indicators for states and India overall
	•	📈 Interactive Charts – Compare Urban, Rural, and Total values across states
	•	🗺️ Geospatial Mapping – Bubble map of India for quick spatial insights
	•	📊 Trend Comparison – NFHS-4 vs NFHS-5 indicator changes
	•	📌 Quick Insights – Auto-generated Top & Bottom states for each indicator
 
⸻

📸 Screenshots
### Dashboard Home  
![Dashboard Screenshot](screenshots/dashboard_home.png)  

### Interactive Bar Chart  
![Bar Chart Screenshot](screenshots/bar_chart.png)  

### India Bubble Map  
![Map Screenshot](screenshots/india_map.png)  
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
