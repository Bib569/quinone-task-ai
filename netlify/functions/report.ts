const SYSTEM_PROMPT = `You are QuantumTask Report Generator, an expert computational chemistry AI with PhD-level knowledge across ALL areas of quantum chemistry. You produce structured, publication-quality molecular analysis reports.

## YOUR EXPERTISE
**Wavefunction Theory**: HF, MP2, MP4, CCSD, CCSD(T) (gold standard, O(N⁷)), CCSDT, EOM-CCSD, ADC(n), CISD, FCI.
**Multi-Reference**: CASSCF(n,m), CASPT2 (±0.1-0.2 eV excitation energies), NEVPT2 (intruder-free), MRCI+Q, DMRG, Selected-CI.
**DFT (Jacob's Ladder)**:
- Rung 1 LDA: SVWN, PW92 — overbinding, metals.
- Rung 2 GGA: PBE (non-empirical), BLYP, BP86, PW91, PBEsol, HCTH.
- Rung 3 meta-GGA: TPSS, M06-L, SCAN (17 constraints), r²SCAN, B97M-V.
- Rung 4a Global Hybrid: B3LYP (20% HFx, organic standard), PBE0 (25%), M06-2X (54%, barriers), TPSSh (10%, TM), M06, MN15, revM06.
- Rung 4b RSH: CAM-B3LYP (CT excitations), ωB97X-D (+dispersion), ωB97X-V/ωB97M-V (top accuracy), HSE06 (solids), LC-ωPBE, M11.
- Rung 5 Double Hybrid: B2-PLYP, B2GP-PLYP, DSD-BLYP-D3, XYG3 — near-CCSD(T).
**TD-DFT**: Runge-Gross theorem (1984). Casida equation (A B; B* A*)(X;Y)=ω(1 0; 0 −1)(X;Y). Local excitations: B3LYP/PBE0. CT states: MUST use CAM-B3LYP/ωB97X-D. TDA approximation (B=0). Excited-state geometry optimization → Stokes shift.
**Many-Body**: GW quasiparticle energies, BSE optical spectra (excitonic effects), DFT+U for correlated d/f electrons.
**Semi-empirical**: Hückel MO, AM1, PM7, GFN2-xTB (conformer generation), DFTB3.
**Basis Sets**: STO-3G; Pople 6-31G*, 6-311+G(2d,p); Dunning cc-pVDZ/TZ/QZ/aug-cc-pVTZ (CBS extrapolation); Karlsruhe def2-SVP/TZVP/QZVP (+D diffuse variants); Jensen pc-n; ANO-RCC; LANL2DZ/SDD (ECPs for heavy atoms).
**Key Math**: E[ρ]=Ts+J+Exc+Vext; KS eqs: (−½∇²+vKS)φᵢ=εᵢφᵢ; IP≈−ε_HOMO (Koopmans); E_gap≈ε_LUMO−ε_HOMO; D3 dispersion; CBS: E_CBS=(X³E_X−Y³E_Y)/(X³−Y³).

## REPORT FORMAT

### Molecular Identity
Brief description, molecular class, CAS/SMILES, known applications and biological/industrial significance.

### Structural Analysis
Functional groups, aromaticity, conjugation length, ring systems. Explain how each structural feature influences electronic and physical properties. Reference substituent effects: EWG lowers HOMO/LUMO (shifts gap); EDG raises HOMO (narrows gap if LUMO less affected).

### Electronic Properties
Interpret HOMO, LUMO, and HOMO-LUMO gap values precisely. If DFT reference values provided (B3LYP/6-31G*): cite level of theory, compare to experimental if known. If ML-predicted (k-NN): discuss confidence, uncertainty (±0.3-0.5 eV), and validate against structural analogy. Relate gap to: redox potential (ΔE_red ≈ LUMO), optical absorption (λ_max ≈ 1240/E_gap nm estimate), reactivity as electrophile/nucleophile.

### Recommended Calculation Methods
Based on the molecule's features, recommend:
- **For this structure**: optimal method + basis set with scientific justification.
- **Ground state**: e.g., B3LYP/def2-TZVP for organic, PBE0/def2-TZVP for TM.
- **Excited states**: TD-DFT with appropriate functional (RSH if CT expected).
- **High accuracy**: CCSD(T)/aug-cc-pVTZ or CBS for benchmarking.
- **Dispersion**: D3BJ or D4 correction if non-covalent interactions relevant.

### Comparison with Quinone Dataset
If in dataset: compare HOMO/LUMO/gap with structurally similar quinones, explain differences via substituent effects.
If not in dataset: identify closest analogues, discuss structural similarities, contextualize predicted gap vs reference quinone values.

### Potential Applications
Based on electronic and molecular properties: redox flow batteries (window: gap 2.5-3.5 eV), organic electronics/OPV, pharmaceutical (cytotoxicity via ROS), photocatalysis, dye-sensitized solar cells, organic magnets.

### Future Perspectives
Suggest what additional computational studies would add value: geometry optimization at higher level, TD-DFT excited states, CASSCF for multi-reference, periodic DFT if solid-state relevant, ML potential for dynamics.

### Summary
3-4 sentences: key electronic properties, their origin in structure, recommended applications, and next computational steps. Note uncertainty for ML-predicted values.

Use markdown formatting with tables, chemical notation, proper units (eV, Å, kcal/mol), and be scientifically rigorous.`;

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { smiles, moleculeName, moleculeResult, thinking } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'OPENROUTER_API_KEY not configured' } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let userPrompt = `Generate a detailed chemistry report for the following molecule:\n\n`;
    userPrompt += `**SMILES:** ${smiles}\n`;
    if (moleculeName) userPrompt += `**Name:** ${moleculeName}\n`;

    if (moleculeResult?.dftData) {
      userPrompt += `\n**DFT Reference Data (B3LYP/6-31G*):**\n`;
      userPrompt += `- Name: ${moleculeResult.dftData.name}\n`;
      userPrompt += `- Family: ${moleculeResult.dftData.family}\n`;
      userPrompt += `- HOMO: ${moleculeResult.dftData.homo_ev} eV\n`;
      userPrompt += `- LUMO: ${moleculeResult.dftData.lumo_ev} eV\n`;
      userPrompt += `- HOMO-LUMO Gap: ${moleculeResult.dftData.homo_lumo_gap_ev} eV\n`;
    } else if (moleculeResult?.predictedData) {
      const pd = moleculeResult.predictedData as Record<string, unknown>;
      userPrompt += `\n**ML-Predicted Electronic Properties (k-NN, quinone reference dataset):**\n`;
      userPrompt += `- Predicted HOMO: ${pd.homo_ev} eV\n`;
      userPrompt += `- Predicted LUMO: ${pd.lumo_ev} eV\n`;
      userPrompt += `- Predicted HOMO-LUMO Gap: ${pd.homo_lumo_gap_ev} eV\n`;
      userPrompt += `- Method: ${pd.method}\n`;
      userPrompt += `- Confidence: ${pd.confidence} (nearest reference: ${pd.nearestNeighbor}, distance: ${pd.nearestDistance})\n`;
      userPrompt += `- Uncertainty: ±0.3–0.5 eV (typical for k-NN structural descriptor predictions)\n`;
      userPrompt += `*Note: These are ML estimates based on structural similarity to the 25-quinone DFT dataset, not computed quantum chemistry values.*\n`;
    } else {
      userPrompt += `\n*Note: This molecule is NOT in the DFT reference dataset. Provide qualitative analysis based on structure.*\n`;
    }

    if (moleculeResult?.pubchemProperties) {
      const p = moleculeResult.pubchemProperties;
      userPrompt += `\n**PubChem Computed Properties:**\n`;
      if (p.MolecularFormula) userPrompt += `- Formula: ${p.MolecularFormula}\n`;
      if (p.MolecularWeight) userPrompt += `- MW: ${p.MolecularWeight} g/mol\n`;
      if (p.XLogP !== undefined) userPrompt += `- XLogP: ${p.XLogP}\n`;
      if (p.TPSA !== undefined) userPrompt += `- TPSA: ${p.TPSA} A²\n`;
      if (p.HBondDonorCount !== undefined) userPrompt += `- HBD: ${p.HBondDonorCount}\n`;
      if (p.HBondAcceptorCount !== undefined) userPrompt += `- HBA: ${p.HBondAcceptorCount}\n`;
      if (p.RotatableBondCount !== undefined) userPrompt += `- Rotatable bonds: ${p.RotatableBondCount}\n`;
      if (p.HeavyAtomCount !== undefined) userPrompt += `- Heavy atoms: ${p.HeavyAtomCount}\n`;
    }

    const model = 'openrouter/free';

    const requestBody: Record<string, unknown> = {
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://quinone-task-ai.netlify.app',
        'X-Title': 'QuantumTask - Molecular Property Analyzer',
      },
      body: JSON.stringify(requestBody),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Handle cases where OpenRouter returns HTML instead of JSON
      const responseText = await response.text();
      console.error('OpenRouter response parsing error:', parseError);
      console.error('Response text:', responseText);
      
      // Return a more informative error message
      return new Response(
        JSON.stringify({ 
          error: { 
            message: `Invalid response format from OpenRouter Free Router. Expected JSON but received: ${responseText.substring(0, 200)}...`,
            details: 'The OpenRouter Free Router may have routed to a model that returned HTML instead of JSON. Please try again.'
          }
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: response.ok ? 200 : response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: { message } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

