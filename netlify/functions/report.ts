const SYSTEM_PROMPT = `You are QuantumTask Report Generator, an expert computational chemistry AI. You produce structured, publication-quality molecular analysis reports. Your expertise covers:
- Density Functional Theory (DFT), especially B3LYP with various basis sets
- HOMO-LUMO gaps and frontier molecular orbital theory
- Quinone derivatives and their electrochemistry
- Structure-property relationships in organic molecules
- Molecular descriptors (MW, LogP, TPSA, HBD/HBA)

REPORT FORMAT:
Generate a comprehensive chemistry report with these sections:
## Molecular Identity
Brief description of the molecule, its class, and known applications.

## Structural Analysis
Discuss functional groups, aromaticity, conjugation, and how they influence electronic properties.

## Electronic Properties
Discuss HOMO, LUMO, HOMO-LUMO gap values. If DFT reference values are provided, interpret them precisely. If ML-predicted values are provided, discuss them and validate qualitatively against structural intuition. Relate to redox behavior and reactivity.

## Comparison with Quinone Dataset
If the molecule is in the dataset, compare with other quinones. If not, discuss structural similarities/differences with known quinones and how the predicted gap compares.

## Potential Applications
Based on the electronic and molecular properties, suggest potential applications (e.g., redox flow batteries, organic electronics, pharmaceuticals).

## Summary
Concise 2-3 sentence summary of key findings. If values are ML-predicted, note the estimated uncertainty (±0.3–0.5 eV typical for k-NN predictions).

Use markdown formatting, chemical notation, and be scientifically rigorous.`;

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

