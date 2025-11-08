
document.addEventListener("DOMContentLoaded", () => {
  const fuelSelect = document.getElementById("fuelSelect");
  fuels.forEach(fuel => {
    const option = document.createElement("option");
    option.value = fuel.name;
    option.textContent = `${fuel.name} (${fuel.formula})`;
    fuelSelect.appendChild(option);
  });

  document.getElementById("calorimetry-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const waterAmount = parseFloat(document.getElementById("waterAmount").value);
    const waterUnit = document.getElementById("waterUnit").value;
    const calorimeterWaterEquivalent = parseFloat(document.getElementById("calorimeterWaterEquivalent").value);
    const calorimeterUnit = document.getElementById("calorimeterUnit").value;
    const initialTemp = parseFloat(document.getElementById("initialTemp").value);
    const finalTemp = parseFloat(document.getElementById("finalTemp").value);
    const specificHeat = parseFloat(document.getElementById("specificHeat").value);
    const specificHeatUnit = document.getElementById("specificHeatUnit").value;
    const fuelName = document.getElementById("fuelSelect").value;
    const fuelAmount = parseFloat(document.getElementById("fuelAmount").value);
    const fuelAmountUnit = document.getElementById("fuelAmountUnit").value;
    const efficiency = parseFloat(document.getElementById("efficiency").value);

    const fuel = fuels.find(f => f.name === fuelName);
    if (!fuel) return;

    let m_water = waterUnit === "kg" ? waterAmount * 1000 : waterAmount;
    if (waterUnit === "mL" || waterUnit === "L") {
      m_water = waterUnit === "L" ? waterAmount * 1000 : waterAmount;
    }

    let m_calorimeter = calorimeterUnit === "kg" ? calorimeterWaterEquivalent * 1000 : calorimeterWaterEquivalent;
    let c = specificHeatUnit === "J/kgC" ? specificHeat / 1000 : specificHeat;

    const deltaT = finalTemp - initialTemp;
    const Q1 = (m_water + m_calorimeter) * c * deltaT;

    let Q2 = 0;
    let resultHTML = `<h3>📊 Emaitzak:</h3>`;
    let eta = isNaN(efficiency) ? 1 : efficiency / 100;

    if (!isNaN(fuelAmount)) {
      let n = fuelAmountUnit === "g" ? fuelAmount / fuel.molarMass : fuelAmount;
      Q2 = n * Math.abs(fuel.enthalpy) * 1000;
      resultHTML += `<p>🔥 Erregaiak emandako beroa: <strong>${Q2.toFixed(2)} J</strong></p>`;
      const deltaH_calc = -(Q1 / n) / 1000;
      resultHTML += `<p>🧪 Entalpia kalkulatua: <strong>${deltaH_calc.toFixed(2)} kJ/mol</strong></p>`;
    } else {
      const n_needed = Q1 / (Math.abs(fuel.enthalpy) * 1000 * eta);
      const m_needed = n_needed * fuel.molarMass;
      resultHTML += `<p>🧪 Behar den erregai kantitatea: <strong>${n_needed.toFixed(4)} mol</strong> (${m_needed.toFixed(2)} g)</p>`;
    }

    document.getElementById("results").innerHTML = resultHTML;
  });
});
