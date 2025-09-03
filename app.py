import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Maternal & Child Health Dashboard", layout="wide")

st.title("📊 Maternal & Child Health Dashboard")
st.write("This dashboard visualizes maternal and child health indicators from NFHS-5 (2019–21).")

# Load cleaned dataset from GitHub
url = "https://raw.githubusercontent.com/sameekshajangra/Maternal-Child-Health-Dashboard/refs/heads/main/data/NFHS5_states_clean.csv"
df = pd.read_csv(url)

# Dataset Preview
st.subheader("📂 Dataset Preview")
st.dataframe(df.head())

# Interactive Indicator Chart
st.subheader("📈 Indicator Comparison")

if "indicator" in df.columns:
    # Dropdown to choose indicator
    indicator_choice = st.selectbox("Choose an indicator:", df["indicator"].unique())

    # Filter for selected indicator
    filtered = df[df["indicator"] == indicator_choice]

    # Grouped bar chart: urban, rural, total
    fig = px.bar(
        filtered,
        x="state",
        y=["nfhs5_urban", "nfhs5_rural", "nfhs5_total"],
        barmode="group",
        title=f"{indicator_choice} (NFHS-5)"
    )

    st.plotly_chart(fig, use_container_width=True)
else:
    st.error("Dataset format issue: 'indicator' column not found.")
