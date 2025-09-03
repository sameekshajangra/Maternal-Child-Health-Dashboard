import streamlit as st
import pandas as pd
import plotly.express as px

# -------------------------
# Page config
# -------------------------
st.set_page_config(page_title="Maternal & Child Health Dashboard", layout="wide")

# -------------------------
# Title & description
# -------------------------
st.title("📊 Maternal & Child Health Dashboard")
st.write("This dashboard visualizes maternal and child health indicators from NFHS-5 (2019–21).")

# -------------------------
# Load dataset
# -------------------------
url = "https://raw.githubusercontent.com/sameekshajangra/Maternal-Child-Health-Dashboard/refs/heads/main/data/NFHS5_states_clean.csv"
df = pd.read_csv(url)

# -------------------------
# Dataset Preview
# -------------------------
st.subheader("📂 Dataset Preview")
st.dataframe(df.head())

# -------------------------
# Sidebar Filters
# -------------------------
st.sidebar.header("🔎 Filters")

# Indicator dropdown in sidebar
indicator_choice = st.sidebar.selectbox("Choose an indicator:", sorted(df["indicator"].dropna().unique()))

# NFHS round radio button in sidebar
round_choice = st.sidebar.radio(
    "Choose survey round:",
    ["nfhs5_total", "nfhs4_total"],
    format_func=lambda x: "NFHS-5 (2019–21)" if x == "nfhs5_total" else "NFHS-4 (2015–16)"
)

# -------------------------
# Bar Chart
# -------------------------
st.subheader(f"📈 {indicator_choice} — { 'NFHS-5' if round_choice=='nfhs5_total' else 'NFHS-4' }")

filtered = df[df["indicator"] == indicator_choice]

if round_choice in filtered.columns:
    # Sort states by chosen round value
    filtered = filtered.sort_values(by=round_choice, ascending=False)

    fig = px.bar(
        filtered,
        x="state",
        y=round_choice,
        title=f"{indicator_choice} across states ({ 'NFHS-5' if round_choice=='nfhs5_total' else 'NFHS-4' })",
        labels={round_choice: "Value", "state": "State"},
    )
    st.plotly_chart(fig, use_container_width=True)
else:
    st.error(f"Column {round_choice} not found in dataset.")
