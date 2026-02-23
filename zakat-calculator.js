// zakat-calculator.js — handles multi-step form, nisab calculation, and zakat results

(function () {
  let currentStep = 1;
  const totalSteps = 4;

  const form = document.getElementById("zakat-form");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const currencySelect = document.getElementById("currency");
  const currencyTexts = document.querySelectorAll(".currency-text");

  // Nisab Constants (Grams)
  const GOLD_NISAB_GRAMS = 87.48;
  const SILVER_NISAB_GRAMS = 612.36;
  const VORI_GRAMS = 11.664; // Standard in Bangladesh

  // Initialize
  updateNisab();

  // Navigation Logic
  nextBtn.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStep();
    } else {
      resetCalculator();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateStep();
    }
  });

  // Handle Currency Change
  currencySelect.addEventListener("change", (e) => {
    const currency = e.target.value;
    currencyTexts.forEach(el => el.textContent = currency);
    updateNisab();
  });

  // Update Nisab on price change
  document.getElementById("gold-price").addEventListener("input", updateNisab);
  document.getElementById("silver-price").addEventListener("input", updateNisab);

  // Live calculation updates
  document.querySelectorAll(".asset-input, .debt-input").forEach(input => {
    input.addEventListener("input", calculateTotals);
  });

  function updateStep() {
    // Update step visibility
    document.querySelectorAll(".calc-step").forEach(step => {
      step.style.display = "none";
      step.classList.remove("active");
    });
    
    const activeStep = document.getElementById(`step-${currentStep}`);
    activeStep.style.display = "block";
    // Trigger animation re-flow
    void activeStep.offsetWidth;
    activeStep.classList.add("active");

    // Update step indicators
    document.querySelectorAll(".step").forEach((step, idx) => {
      const stepNum = idx + 1;
      step.classList.remove("active", "completed");
      if (stepNum === currentStep) {
        step.classList.add("active");
      } else if (stepNum < currentStep) {
        step.classList.add("completed");
      }
    });

    // Handle button text and visibility
    prevBtn.style.display = currentStep === 1 ? "none" : "block";
    if (currentStep === totalSteps) {
      nextBtn.textContent = "Calculate Again";
      calculateTotals();
    } else if (currentStep === totalSteps - 1) {
      nextBtn.textContent = "View Summary";
    } else {
      nextBtn.textContent = "Next Step";
    }

    // Scroll to top of section for better UX
    const container = document.querySelector(".calculator-container");
    const containerTop = container.getBoundingClientRect().top + window.pageYOffset - 120;
    window.scrollTo({ top: containerTop, behavior: 'smooth' });
  }

  function updateNisab() {
    const goldPrice = parseFloat(document.getElementById("gold-price").value) || 0;
    const silverPrice = parseFloat(document.getElementById("silver-price").value) || 0;

    // Gram calculations
    const goldNisabTotal = goldPrice * GOLD_NISAB_GRAMS;
    const silverNisabTotal = silverPrice * SILVER_NISAB_GRAMS;

    // Vori calculations
    const goldVoriPrice = goldPrice * VORI_GRAMS;
    const silverVoriPrice = silverPrice * VORI_GRAMS;

    // Update UI
    document.getElementById("nisab-gold").textContent = goldNisabTotal.toLocaleString(undefined, { maximumFractionDigits: 0 });
    document.getElementById("nisab-silver").textContent = silverNisabTotal.toLocaleString(undefined, { maximumFractionDigits: 0 });
    
    document.getElementById("gold-vori-price").textContent = goldVoriPrice.toLocaleString(undefined, { maximumFractionDigits: 0 });
    document.getElementById("silver-vori-price").textContent = silverVoriPrice.toLocaleString(undefined, { maximumFractionDigits: 0 });
    
    return silverNisabTotal; // Using silver as the safer common threshold
  }

  function calculateTotals() {
    let totalAssets = 0;
    document.querySelectorAll(".asset-input").forEach(input => {
      totalAssets += parseFloat(input.value) || 0;
    });

    let totalDebts = 0;
    document.querySelectorAll(".debt-input").forEach(input => {
      totalDebts += parseFloat(input.value) || 0;
    });

    const netValue = totalAssets - totalDebts;
    const nisabThreshold = updateNisab();
    
    let zakatPayable = 0;
    const nisabStatusEl = document.getElementById("nisab-status");

    if (netValue >= nisabThreshold && netValue > 0) {
      zakatPayable = netValue * 0.025;
      nisabStatusEl.innerHTML = "<span>✓</span> You are eligible for Zakat";
      nisabStatusEl.style.color = "var(--primary)";
    } else if (netValue <= 0) {
      zakatPayable = 0;
      nisabStatusEl.innerHTML = "<span>ℹ</span> No Zakat due (Net wealth is zero or negative)";
      nisabStatusEl.style.color = "#64748b";
    } else {
      zakatPayable = 0;
      nisabStatusEl.innerHTML = "<span>⚠</span> Below Nisab threshold (No Zakat due)";
      nisabStatusEl.style.color = "#ef4444";
    }

    // Update Summary Page
    document.getElementById("summary-assets").textContent = totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("summary-debts").textContent = totalDebts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("summary-net").textContent = netValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("final-zakat").textContent = zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function resetCalculator() {
    currentStep = 1;
    form.reset();
    updateNisab();
    updateStep();
    calculateTotals();
  }

})();
