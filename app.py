import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Maternal & Child Health Dashboard", layout="wide")

st.title("📊 Maternal & Child Health Dashboard")
st.write("This dashboard visualizes maternal and child health indicators from NFHS-5 (2019–21).")

# Load cleaned dataset from GitHub
url = "https://raw.githubusercontent.com/sameekshajangra/Maternal-Child-Health-Dashboard/main/data/NFHS5-States-Clean.csv"
df = pd.read_csv(url)

# Dataset Preview
st.subheader("📂 Dataset Preview")
st.dataframe(df.head())

# Simple Bar Chart Example
st.subheader("📈 Sample Indicator Chart")
if "State" in df.columns and "Value" in df.columns:
    fig = px.bar(
        df.head(20),
        x="State",
        y="Value",
        color="Indicator",
        title="Sample Indicators by State"
    )
    st.plotly_chart(fig, use_container_width=True)
else:
    st.error("Dataset format issue: 'State' and 'Value' columns not found.")
