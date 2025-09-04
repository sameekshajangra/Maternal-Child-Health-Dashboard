📊 Maternal & Child Health Dashboard

A data-driven interactive dashboard built using Python, Streamlit, and Plotly to visualize key Maternal & Child Health indicators from the NFHS-5 (2019–21) and NFHS-4 (2015–16) surveys.

👉 Live Demo: 👉 **Live Demo:** [Streamlit App](https://maternal-child-health-dashboard-4appugn5fq9hjg4jzmlkwhk.streamlit.app/)
⸻

✨ Features

	•	📂 Dataset Preview – Clean NFHS-5 dataset with state-wise indicators.
	•	🎛 Sidebar Filters – Select indicators and compare NFHS-4 vs NFHS-5.
	•	📈 Interactive Bar Charts – State-wise comparison across rounds.
	•	🗺️ Bubble Maps – Geographic visualization of indicator distribution.
	•	🔥 Heatmap – Compare multiple key health indicators across states.
	•	📌 Quick Insights – Automatically highlights top 3 & bottom 3 states.
	•	🔄 Change Over Time – Identifies biggest improvers and decliners.
	•	🏥 State Profiles – Gradient cards for key indicators + grouped bar chart progress.
 
⸻

🛠️ Tech Stack

	•	Python
	•	Streamlit – frontend dashboard
	•	Plotly Express – interactive visualizations
	•	Pandas / NumPy – data handling
	•	GitHub Pages + Streamlit Cloud – deployment


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

 Clone repository

git clone https://github.com/sameekshajangra/Maternal-Child-Health-Dashboard.git
cd Maternal-Child-Health-Dashboard

 Install dependencies
 
pip install -r requirements.txt

 Run Streamlit app
 
streamlit run app.py


⸻

🌍 Motivation & Relevance

This project was created to make maternal and child health data easy to understand and use. By turning survey numbers into interactive visuals, it highlights gaps, progress, and state-wise differences. The goal is to support better awareness, planning, and decisions that improve the lives of women and children.

🚀 Future Improvements

	•	Add time-series data from earlier NFHS rounds.
	•	Introduce district-level granularity.
	•	Build predictive analytics for maternal & child health indicators.
