import streamlit as st
import pandas as pd
import plotly.express as px
import numpy as np

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

indicator_choice = st.sidebar.selectbox("Choose an indicator:", sorted(df["indicator"].dropna().unique()))

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

# -------------------------
# NFHS-4 vs NFHS-5 comparison & insights
# -------------------------
if {"nfhs4_total", "nfhs5_total"}.issubset(filtered.columns):
    comp = filtered.copy()
    comp["nfhs4_total"] = pd.to_numeric(comp["nfhs4_total"], errors="coerce")
    comp["nfhs5_total"] = pd.to_numeric(comp["nfhs5_total"], errors="coerce")

    comp["abs_change"] = comp["nfhs5_total"] - comp["nfhs4_total"]
    comp["pct_change"] = np.where(
        comp["nfhs4_total"].fillna(0) == 0,
        np.nan,
        comp["abs_change"] / comp["nfhs4_total"] * 100
    )
    comp["pct_change_round"] = comp["pct_change"].round(1)
    comp = comp.sort_values(by="pct_change", ascending=False)

    st.subheader("🔁 NFHS-4 vs NFHS-5 — Change Summary")

    nat_nfhs4 = comp["nfhs4_total"].mean(skipna=True)
    nat_nfhs5 = comp["nfhs5_total"].mean(skipna=True)
    if not np.isnan(nat_nfhs4) and nat_nfhs4 != 0:
        nat_pct = (nat_nfhs5 - nat_nfhs4) / nat_nfhs4 * 100
        st.write(f"**National average:** NFHS-4 = {nat_nfhs4:.1f}, NFHS-5 = {nat_nfhs5:.1f}, change = {nat_pct:.1f}%")
    else:
        st.write("National NFHS-4 values not available.")

    # Statewise grouped bar
    fig_comp = px.bar(
        comp,
        x="state",
        y=["nfhs4_total", "nfhs5_total"],
        barmode="group",
        title=f"{indicator_choice}: NFHS-4 vs NFHS-5 (statewise)"
    )
    st.plotly_chart(fig_comp, use_container_width=True)

    # Comparison table + download
    display_cols = ["state", "nfhs4_total", "nfhs5_total", "abs_change", "pct_change_round"]
    st.dataframe(
        comp[display_cols].rename(columns={
            "nfhs4_total": "NFHS-4",
            "nfhs5_total": "NFHS-5",
            "abs_change": "Abs Change",
            "pct_change_round": "% Change"
        })
    )

    csv_out = comp[display_cols].to_csv(index=False)
    st.download_button("⬇️ Download comparison CSV", csv_out, file_name="nfhs_comparison.csv", mime="text/csv")

    # Quick auto insights
    st.markdown("#### 🔍 Quick Insights (Change over time)")
    top_gain = comp.nlargest(3, "pct_change").dropna(subset=["pct_change"])
    top_decline = comp.nsmallest(3, "pct_change").dropna(subset=["pct_change"])

    if not top_gain.empty:
        st.markdown("**Top improvements:**")
        for _, r in top_gain.iterrows():
            st.write(f"- **{r['state']}**: {r['pct_change_round']}% ({r['nfhs4_total']} → {r['nfhs5_total']})")

    if not top_decline.empty:
        st.markdown("**Largest declines:**")
        for _, r in top_decline.iterrows():
            st.write(f"- **{r['state']}**: {r['pct_change_round']}% ({r['nfhs4_total']} → {r['nfhs5_total']})")

# -------------------------
# NFHS-4 vs NFHS-5 Change Insights (Styled Cards)
# -------------------------
st.subheader("📊 Change Insights: NFHS-4 → NFHS-5")

if {"nfhs4_total", "nfhs5_total"}.issubset(filtered.columns):
    comp = filtered.copy()
    comp["nfhs4_total"] = pd.to_numeric(comp["nfhs4_total"], errors="coerce")
    comp["nfhs5_total"] = pd.to_numeric(comp["nfhs5_total"], errors="coerce")

    comp["abs_change"] = comp["nfhs5_total"] - comp["nfhs4_total"]
    comp["pct_change"] = np.where(
        comp["nfhs4_total"].fillna(0) == 0,
        np.nan,
        comp["abs_change"] / comp["nfhs4_total"] * 100
    )
    comp["pct_change_round"] = comp["pct_change"].round(1)

    top_gain = comp.nlargest(3, "pct_change").dropna(subset=["pct_change"])
    top_decline = comp.nsmallest(3, "pct_change").dropna(subset=["pct_change"])

    col3, col4 = st.columns(2)

    with col3:
        st.markdown(
            "<div style='background-color:#dbeafe; padding:15px; border-radius:10px;'>"
            "<h4 style='color:#1e3a8a;'>📈 Biggest Improvements</h4>"
            + "".join([f"<p><b>{row['state']}</b>: {row['pct_change_round']}% ({row['nfhs4_total']} → {row['nfhs5_total']})</p>" for _, row in top_gain.iterrows()])
            + "</div>",
            unsafe_allow_html=True
        )

    with col4:
        st.markdown(
            "<div style='background-color:#fff3cd; padding:15px; border-radius:10px;'>"
            "<h4 style='color:#856404;'>📉 Largest Declines</h4>"
            + "".join([f"<p><b>{row['state']}</b>: {row['pct_change_round']}% ({row['nfhs4_total']} → {row['nfhs5_total']})</p>" for _, row in top_decline.iterrows()])
            + "</div>",
            unsafe_allow_html=True
        )
else:
    st.info("NFHS-4 data not available for this indicator.")

# -------------------------
# -------------------------
# Correlation Heatmap (across indicators)
# -------------------------
st.subheader("📊 Correlation Between Indicators")

# Pivot data: states × indicators
wide_df = df.pivot_table(index="state", columns="indicator", values=round_choice, aggfunc="mean")

# Drop columns with too many missing values
wide_df = wide_df.dropna(axis=1, thresh=len(wide_df) - 5)

if not wide_df.empty:
    corr = wide_df.corr().round(2)

    fig_heat = px.imshow(
        corr,
        text_auto=False,  # Don't print all numbers (less cluttered)
        color_continuous_scale="RdBu_r",
        title=f"Correlation of Indicators ({'NFHS-5' if round_choice=='nfhs5_total' else 'NFHS-4'})",
        aspect="auto"
    )

    # Rotate x-axis labels for readability
    fig_heat.update_xaxes(tickangle=45)
    fig_heat.update_yaxes(tickangle=0)

    # Make bigger
    fig_heat.update_layout(
        width=900,
        height=700,
        margin=dict(l=100, r=100, t=100, b=100)
    )

    st.plotly_chart(fig_heat, use_container_width=True)

    st.info("A high positive correlation means two indicators improve together (e.g., female literacy & institutional deliveries). A negative correlation means trade-offs.")
else:
    st.warning("Not enough data to compute correlation heatmap.")
# -------------------------
# Bubble Map of India (with Outline)
# -------------------------
st.subheader(f"🗺️ Bubble Map — {indicator_choice}")

# Approximate lat/lon coordinates for states
state_coords = {
    "Andaman & Nicobar Islands": (11.667, 92.736),
    "Andhra Pradesh": (16.506, 80.648),
    "Arunachal Pradesh": (27.084, 93.605),
    "Assam": (26.200, 92.937),
    "Bihar": (25.096, 85.313),
    "Chhattisgarh": (21.251, 81.629),
    "Delhi": (28.7041, 77.1025),
    "Goa": (15.299, 74.124),
    "Gujarat": (22.309, 72.136),
    "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1734),
    "Jammu & Kashmir": (33.778, 76.576),
    "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (12.9716, 77.5946),
    "Kerala": (10.8505, 76.2711),
    "Ladakh": (34.2268, 77.5619),
    "Lakshadweep": (10.5667, 72.6417),
    "Madhya Pradesh": (23.2599, 77.4126),
    "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.817, 93.936),
    "Meghalaya": (25.467, 91.366),
    "Mizoram": (23.164, 92.937),
    "Nagaland": (26.158, 94.562),
    "Odisha": (20.9517, 85.0985),
    "Puducherry": (11.9416, 79.8083),
    "Punjab": (31.1471, 75.3412),
    "Rajasthan": (26.9124, 75.7873),
    "Sikkim": (27.533, 88.512),
    "Tamil Nadu": (11.1271, 78.6569),
    "Telangana": (17.385, 78.4867),
    "Tripura": (23.8315, 91.2868),
    "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.3165, 78.0322),
    "West Bengal": (22.9868, 87.8550),
    "Dadra & Nagar Haveli and Daman & Diu": (20.397, 72.832),
    "Chandigarh": (30.7333, 76.7794),
}

map_df = filtered.copy()
map_df["lat"] = map_df["state"].map(lambda s: state_coords.get(s, (None, None))[0])
map_df["lon"] = map_df["state"].map(lambda s: state_coords.get(s, (None, None))[1])
map_df = map_df.dropna(subset=["lat", "lon"])

fig_map = px.scatter_geo(
    map_df,
    lat="lat",
    lon="lon",
    size=round_choice,
    color=round_choice,
    hover_name="state",
    projection="mercator",
    title=f"{indicator_choice} — { 'NFHS-5' if round_choice=='nfhs5_total' else 'NFHS-4' } (Bubble Map)",
    color_continuous_scale="Viridis",
    size_max=30
)

fig_map.update_geos(
    scope="asia",
    showcountries=True,
    countrycolor="Black",
    showsubunits=True,
    subunitcolor="Gray",
    fitbounds="locations",
    lataxis_range=[6, 37],
    lonaxis_range=[68, 98],
    bgcolor="white"  # Force light background
)

fig_map.update_layout(
    margin={"r":0,"t":40,"l":0,"b":0}
)

st.plotly_chart(fig_map, use_container_width=True)

# -------------------------
# -------------------------
# Insight Box: Top 3 & Bottom 3 States (Styled Cards)
# -------------------------
st.subheader("📌 Quick Insights")

if round_choice in filtered.columns:
    top3 = filtered.nlargest(3, round_choice)[["state", round_choice]]
    bottom3 = filtered.nsmallest(3, round_choice)[["state", round_choice]]

    col1, col2 = st.columns(2)

    with col1:
        st.markdown(
            "<div style='background-color:#d4edda; padding:15px; border-radius:10px;'>"
            "<h4 style='color:#155724;'>🔼 Top 3 States</h4>"
            + "".join([f"<p><b>{row['state']}</b>: {row[round_choice]}</p>" for _, row in top3.iterrows()])
            + "</div>",
            unsafe_allow_html=True
        )

    with col2:
        st.markdown(
            "<div style='background-color:#f8d7da; padding:15px; border-radius:10px;'>"
            "<h4 style='color:#721c24;'>🔽 Bottom 3 States</h4>"
            + "".join([f"<p><b>{row['state']}</b>: {row[round_choice]}</p>" for _, row in bottom3.iterrows()])
            + "</div>",
            unsafe_allow_html=True
        )
else:
    st.info("Insights not available for this dataset.")
