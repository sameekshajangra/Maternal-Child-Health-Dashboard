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
# State Profile Selector
# -------------------------
st.sidebar.header("🗺️ State Profile")
selected_state = st.sidebar.selectbox("Choose a state to view profile:", sorted(df["state"].unique()))

# -------------------------
# Step 2: Filter Data for Selected State
# -------------------------
state_data = df[df["state"] == selected_state]

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

# -------------------------
# -------------------------
# Unified Insights Section with Tabs
# -------------------------
st.subheader("📌 Insights")

# Create two tabs
tabs = st.tabs(["📊 Current Snapshot (NFHS-5)", "⏳ Change Over Time (NFHS-4 → NFHS-5)"])

# -------------------------
# Tab 1: Current Snapshot (NFHS-5)
# -------------------------
with tabs[0]:
    if "nfhs5_total" in filtered.columns:
        top3 = filtered.nlargest(3, "nfhs5_total")[["state", "nfhs5_total"]]
        bottom3 = filtered.nsmallest(3, "nfhs5_total")[["state", "nfhs5_total"]]

        col1, col2 = st.columns(2)

        with col1:
            st.markdown(
                "<div style='background-color:#d4edda; padding:15px; border-radius:10px;'>"
                "<h4 style='color:#155724;'>🔼 Top 3 States (NFHS-5)</h4>"
                + "".join([f"<p><b>{row['state']}</b>: {row['nfhs5_total']}</p>" for _, row in top3.iterrows()])
                + "</div>",
                unsafe_allow_html=True
            )

        with col2:
            st.markdown(
                "<div style='background-color:#f8d7da; padding:15px; border-radius:10px;'>"
                "<h4 style='color:#721c24;'>🔽 Bottom 3 States (NFHS-5)</h4>"
                + "".join([f"<p><b>{row['state']}</b>: {row['nfhs5_total']}</p>" for _, row in bottom3.iterrows()])
                + "</div>",
                unsafe_allow_html=True
            )
    else:
        st.info("NFHS-5 data not available for this indicator.")

# -------------------------
# Tab 2: Change Over Time (NFHS-4 → NFHS-5)
# -------------------------
with tabs[1]:
    if "nfhs4_total" in filtered.columns and "nfhs5_total" in filtered.columns:
        filtered["change_pct"] = ((filtered["nfhs5_total"] - filtered["nfhs4_total"]) / filtered["nfhs4_total"]) * 100

        top3_change = filtered.nlargest(3, "change_pct")[["state", "nfhs4_total", "nfhs5_total", "change_pct"]]
        bottom3_change = filtered.nsmallest(3, "change_pct")[["state", "nfhs4_total", "nfhs5_total", "change_pct"]]

        col1, col2 = st.columns(2)

        # ---- Top Improvers ----
        with col1:
            st.markdown(
                "<div style='background-color:#d1ecf1; padding:15px; border-radius:10px;'>"
                "<h4 style='color:#0c5460;'>📈 Top 3 Improvers</h4>",
                unsafe_allow_html=True
            )

            for _, row in top3_change.iterrows():
                st.markdown(f"<b>{row['state']}</b>: {row['change_pct']:.2f}%", unsafe_allow_html=True)

                # Mini line chart
                mini_df = pd.DataFrame({
                    "Survey Round": ["NFHS-4", "NFHS-5"],
                    "Value": [row["nfhs4_total"], row["nfhs5_total"]]
                })

                mini_chart = px.line(
                    mini_df,
                    x="Survey Round",
                    y="Value",
                    markers=True,
                    title=f"{row['state']} Progress"
                )
                mini_chart.update_layout(margin=dict(l=0, r=0, t=30, b=0), height=250, width=300)
                st.plotly_chart(mini_chart, use_container_width=False)

            st.markdown("</div>", unsafe_allow_html=True)

        # ---- Bottom Decliners ----
        with col2:
            st.markdown(
                "<div style='background-color:#fff3cd; padding:15px; border-radius:10px;'>"
                "<h4 style='color:#856404;'>📉 Bottom 3 Decliners</h4>",
                unsafe_allow_html=True
            )

            for _, row in bottom3_change.iterrows():
                st.markdown(f"<b>{row['state']}</b>: {row['change_pct']:.2f}%", unsafe_allow_html=True)

                # Mini line chart
                mini_df = pd.DataFrame({
                    "Survey Round": ["NFHS-4", "NFHS-5"],
                    "Value": [row["nfhs4_total"], row["nfhs5_total"]]
                })

                mini_chart = px.line(
                    mini_df,
                    x="Survey Round",
                    y="Value",
                    markers=True,
                    title=f"{row['state']} Progress"
                )
                mini_chart.update_layout(margin=dict(l=0, r=0, t=30, b=0), height=250, width=300)
                st.plotly_chart(mini_chart, use_container_width=False)

            st.markdown("</div>", unsafe_allow_html=True)
    else:
        st.info("NFHS-4 data not available for this indicator.")

# -------------------------
# State Profile Dashboard
# -------------------------
st.subheader(f"📍 State Profile: {selected_state}")

if not state_data.empty:
    # ---- Card-style Key Stats ----
    st.markdown("### 🧾 Key Stats (NFHS-5 vs NFHS-4)")

    # Pick 3–4 headline indicators to display as cards
    key_stats = state_data[state_data["indicator"].isin([
        "50. Institutional births (%)",
        "54. Births delivered by caesarean section (%)",
        "81. Children under 5 years who are stunted (height-for-age)18 (%)",
        "95. All women age 15-49 years who are anaemic22 (%)"
    ])]

    cols = st.columns(len(key_stats))
    for col, (_, row) in zip(cols, key_stats.iterrows()):
        col.markdown(
            f"""
            <div style="background-color:#f9f9f9; padding:15px; border-radius:12px; 
                        text-align:center; box-shadow:2px 2px 8px rgba(0,0,0,0.1);">
                <h4 style="color:#333; margin-bottom:5px;">{row['indicator']}</h4>
                <p style="margin:0; color:#2c7;">NFHS-5: <b>{row['nfhs5_total']}</b></p>
                <p style="margin:0; color:#888;">NFHS-4: {row['nfhs4_total']}</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    # ---- Progress Bar Chart ----
    st.markdown("### 📈 Progress Over Time (NFHS-4 → NFHS-5)")
    fig_state = px.bar(
        state_data,
        x="indicator",
        y=["nfhs4_total", "nfhs5_total"],
        barmode="group",
        title=f"{selected_state} — NFHS-4 vs NFHS-5",
        labels={"value": "Value", "indicator": "Indicator"},
        color_discrete_map={"nfhs4_total": "#1f77b4", "nfhs5_total": "#ff7f0e"}
    )
    fig_state.update_layout(xaxis_tickangle=-45, height=550)
    st.plotly_chart(fig_state, use_container_width=True)

else:
    st.warning("No data available for this state.")
# Robust Correlation Heatmap (selectable & readable)
# -------------------------
import textwrap

st.subheader("🌡️ Correlation Between Selected Indicators")

# Pivot to wide format (states x indicators)
wide_df = df.pivot_table(index="state", columns="indicator", values=round_choice, aggfunc="mean")

# List of key indicators you'd like (keep or edit these)
key_indicators = [
    "1. Female population age 6 years and above who ever attended school (%)",
    "46. Mothers who received postnatal care from a doctor/nurse/LHV/ANM/midwife/other health personnel within 2 days of delivery (%)",
    "55. Births in a private health facility that were delivered by caesarean section (%)",
    "72. Children with diarrhoea in the 2 weeks preceding the survey taken to a health facility or health provider (%)",
    "80. Total children age 6-23 months receiving an adequate diet16, 17  (%)",
    "97. Men age 15-49 years who are anaemic (<13.0 g/dl)22 (%)",
    "88. Women who are overweight or obese (BMI ≥25.0 kg/m2)21 (%)"
]


# Which of the requested keys actually exist (exact-match)
available_exact = [k for k in key_indicators if k in wide_df.columns]
missing_exact = [k for k in key_indicators if k not in wide_df.columns]

# Inform user about missing keys
if missing_exact:
    st.warning("Some predefined key indicators were not found and will be skipped. You can select alternatives below.")
    with st.expander("Missing indicators (skipped)"):
        for m in missing_exact:
            st.write("- " + m)

# If we have at least 2 exact available, use them; otherwise ask user to choose
if len(available_exact) >= 2:
    chosen = available_exact
else:
    st.info("Not enough predefined key indicators available. Please select indicators for the heatmap (choose 3-8).")
    # show top available columns for ease
    options = list(wide_df.columns)
    default = options[:6] if len(options) >= 6 else options
    chosen = st.multiselect("Choose indicators to include (min 2)", options=options, default=default)

# Ensure user chose at least 2
if not chosen or len(chosen) < 2:
    st.warning("Select at least 2 indicators to display a correlation heatmap.")
else:
    # Subset and drop indicator-columns with too many missing values
    # keep columns with at least 50% non-NA (adjust thresh as needed)
    thresh = int(len(wide_df) * 0.5)
    subset = wide_df[chosen].dropna(axis=1, thresh=thresh)

    if subset.shape[1] < 2:
        st.warning("After removing columns with too many missing values, there are fewer than 2 indicators left. Try selecting different indicators.")
    else:
        # compute correlation
        corr = subset.corr().round(2)

        # shorten long labels for display
        def short(s, width=40):
            return textwrap.shorten(s, width=width, placeholder="...")

        short_map = {col: short(col, width=40) for col in corr.columns}
        corr_display = corr.copy()
        corr_display.columns = [short_map[c] for c in corr_display.columns]
        corr_display.index = corr_display.columns

        import plotly.graph_objects as go
        # create heatmap with annotations
        z = corr_display.values
        x = list(corr_display.columns)
        y = list(corr_display.index)

        fig_heat = go.Figure(data=go.Heatmap(
            z=z,
            x=x,
            y=y,
            colorscale="RdYlBu_r",
            zmin=-1, zmax=1,
            colorbar=dict(title="corr", tickformat=".2f")
        ))

        # add text annotations inside cells
        annotations = []
        for i in range(len(y)):
            for j in range(len(x)):
                annotations.append(
                    dict(
                        x=x[j], y=y[i],
                        text=str(z[i][j]),
                        showarrow=False,
                        font=dict(color="black", size=10)
                    )
                )
        fig_heat.update_layout(
            title=f"Correlation of Selected Indicators ({'NFHS-5' if round_choice=='nfhs5_total' else 'NFHS-4'})",
            xaxis=dict(tickangle=30),
            yaxis=dict(autorange="reversed"),
            annotations=annotations,
            width=900,
            height=700,
            margin=dict(l=120, r=40, t=80, b=140)
        )

        st.plotly_chart(fig_heat, use_container_width=False)
        st.success("✅ Heatmap ready. Higher positive values indicate indicators that move together; negative values indicate inverse relations.")

# -------------------------
# Debug: Show all unique indicator names in the dataset
st.subheader("📋 Available Indicators (Debug View)")
st.write(df["indicator"].unique())

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
