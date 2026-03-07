const QUINONE_DATASET = [
  { name: "1,4-Benzoquinone", smiles: "O=C1C=CC(=O)C=C1", gap: 4.27, homo: -8.82, lumo: -4.55, family: "benzoquinone" },
  { name: "2-Methyl-1,4-benzoquinone", smiles: "CC1=CC(=O)C=CC1=O", gap: 4.12, homo: -8.65, lumo: -4.53, family: "benzoquinone" },
  { name: "2,3-Dimethyl-1,4-benzoquinone", smiles: "CC1=C(C)C(=O)C=CC1=O", gap: 3.97, homo: -8.48, lumo: -4.51, family: "benzoquinone" },
  { name: "2,6-Dimethyl-1,4-benzoquinone", smiles: "CC1=CC(=O)C(C)=CC1=O", gap: 3.95, homo: -8.46, lumo: -4.51, family: "benzoquinone" },
  { name: "2-Chloro-1,4-benzoquinone", smiles: "ClC1=CC(=O)C=CC1=O", gap: 4.02, homo: -8.92, lumo: -4.9, family: "benzoquinone" },
  { name: "2,3-Dichloro-1,4-benzoquinone", smiles: "ClC1=C(Cl)C(=O)C=CC1=O", gap: 3.78, homo: -9.05, lumo: -5.27, family: "benzoquinone" },
  { name: "2,5-Dichloro-1,4-benzoquinone", smiles: "ClC1=CC(=O)C(Cl)=CC1=O", gap: 3.79, homo: -9.03, lumo: -5.24, family: "benzoquinone" },
  { name: "2-Methoxy-1,4-benzoquinone", smiles: "COC1=CC(=O)C=CC1=O", gap: 4.05, homo: -8.55, lumo: -4.5, family: "benzoquinone" },
  { name: "2-Hydroxy-1,4-benzoquinone", smiles: "OC1=CC(=O)C=CC1=O", gap: 4.18, homo: -8.68, lumo: -4.5, family: "benzoquinone" },
  { name: "2-Amino-1,4-benzoquinone", smiles: "NC1=CC(=O)C=CC1=O", gap: 3.72, homo: -8.05, lumo: -4.33, family: "benzoquinone" },
  { name: "2,5-Dimethoxy-1,4-benzoquinone", smiles: "COC1=CC(=O)C(OC)=CC1=O", gap: 4.06, homo: -8.5, lumo: -4.44, family: "benzoquinone" },
  { name: "1,4-Naphthoquinone", smiles: "O=C1C=CC(=O)c2ccccc21", gap: 3.52, homo: -8.38, lumo: -4.86, family: "naphthoquinone" },
  { name: "2-Methyl-1,4-naphthoquinone", smiles: "CC1=CC(=O)c2ccccc2C1=O", gap: 3.38, homo: -8.21, lumo: -4.83, family: "naphthoquinone" },
  { name: "2-Hydroxy-1,4-naphthoquinone", smiles: "OC1=CC(=O)c2ccccc2C1=O", gap: 3.45, homo: -8.28, lumo: -4.83, family: "naphthoquinone" },
  { name: "2-Amino-1,4-naphthoquinone", smiles: "NC1=CC(=O)c2ccccc2C1=O", gap: 3.21, homo: -7.92, lumo: -4.71, family: "naphthoquinone" },
  { name: "5-Hydroxy-1,4-naphthoquinone", smiles: "O=C1C=CC(=O)c2c(O)cccc21", gap: 3.2, homo: -8.12, lumo: -4.92, family: "naphthoquinone" },
  { name: "2-Chloro-1,4-naphthoquinone", smiles: "ClC1=CC(=O)c2ccccc2C1=O", gap: 3.35, homo: -8.55, lumo: -5.2, family: "naphthoquinone" },
  { name: "5,8-Dihydroxy-1,4-naphthoquinone", smiles: "O=C1C=CC(=O)c2c(O)ccc(O)c21", gap: 3.05, homo: -7.98, lumo: -4.93, family: "naphthoquinone" },
  { name: "9,10-Anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2ccccc21", gap: 3.12, homo: -8.2, lumo: -5.08, family: "anthraquinone" },
  { name: "1-Hydroxy-9,10-anthraquinone", smiles: "O=C1c2c(O)cccc2C(=O)c2ccccc21", gap: 2.98, homo: -7.95, lumo: -4.97, family: "anthraquinone" },
  { name: "2-Hydroxy-9,10-anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2cc(O)ccc21", gap: 3.02, homo: -8.0, lumo: -4.98, family: "anthraquinone" },
  { name: "1-Amino-9,10-anthraquinone", smiles: "O=C1c2c(N)cccc2C(=O)c2ccccc21", gap: 2.85, homo: -7.72, lumo: -4.87, family: "anthraquinone" },
  { name: "2-Amino-9,10-anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2cc(N)ccc21", gap: 2.92, homo: -7.8, lumo: -4.88, family: "anthraquinone" },
  { name: "1,5-Dihydroxy-9,10-anthraquinone", smiles: "O=C1c2c(O)cccc2C(=O)c2cccc(O)c21", gap: 2.78, homo: -7.68, lumo: -4.9, family: "anthraquinone" },
  { name: "9,10-Anthraquinone-2-sulfonic acid", smiles: "O=C1c2ccccc2C(=O)c2cc(S(=O)(=O)O)ccc21", gap: 3.05, homo: -8.38, lumo: -5.33, family: "anthraquinone" },
];

// Extract structural features from SMILES for k-NN prediction:
// [aromaticC, quinoneCarbonyl, halogen, aminoN, aromaticN]
function extractFeatures(smiles: string): number[] {
  const aromaticC = (smiles.match(/c/g) || []).length;
  // Count C=O specifically (not S=O): look for =O preceded by C or ring context
  const allCarbonyl = (smiles.match(/=O/g) || []).length;
  const sulfoneO = (smiles.match(/S\(=O\)\(=O\)/g) || []).length * 2;
  const carbonylO = Math.max(0, allCarbonyl - sulfoneO);
  const halogens = (smiles.match(/Cl|Br|F(?![a-z])/g) || []).length;
  const aminoN = (smiles.match(/N(?![a-z0-9+\-])/g) || []).length;
  const aromaticN = (smiles.match(/n/g) || []).length;
  return [aromaticC, carbonylO, halogens, aminoN, aromaticN];
}

// Feature normalization scales (max values across training data)
const FEATURE_SCALES = [12, 4, 2, 1, 2];

// Precompute features for all 25 dataset molecules once
const DATASET_WITH_FEATURES = QUINONE_DATASET.map(q => ({
  ...q,
  features: extractFeatures(q.smiles),
}));

// k-NN HOMO-LUMO gap prediction using structural SMILES features
function kNNPredict(smiles: string, k = 3) {
  const queryFeatures = extractFeatures(smiles);

  const distances = DATASET_WITH_FEATURES.map(entry => {
    const dist = Math.sqrt(
      queryFeatures.reduce((sum, val, i) => {
        const scale = FEATURE_SCALES[i] || 1;
        return sum + Math.pow((val - entry.features[i]) / scale, 2);
      }, 0)
    );
    return { entry, dist };
  }).sort((a, b) => a.dist - b.dist);

  const neighbors = distances.slice(0, k);
  const weights = neighbors.map(n => (n.dist < 1e-9 ? 1e9 : 1 / n.dist));
  const totalW = weights.reduce((s, w) => s + w, 0);

  const predGap  = neighbors.reduce((s, n, i) => s + weights[i] * n.entry.gap,  0) / totalW;
  const predHomo = neighbors.reduce((s, n, i) => s + weights[i] * n.entry.homo, 0) / totalW;
  const predLumo = neighbors.reduce((s, n, i) => s + weights[i] * n.entry.lumo, 0) / totalW;

  const minDist = neighbors[0].dist;
  const confidence = minDist < 0.25 ? 'High' : minDist < 0.6 ? 'Medium' : 'Low';

  return {
    homo_ev: Math.round(predHomo * 100) / 100,
    lumo_ev: Math.round(predLumo * 100) / 100,
    homo_lumo_gap_ev: Math.round(predGap * 100) / 100,
    method: 'k-NN (k=3) on SMILES structural descriptors, trained on 25 quinone DFT B3LYP/6-31G* values',
    confidence,
    nearestNeighbor: neighbors[0].entry.name,
    nearestDistance: Math.round(minDist * 100) / 100,
  };
}

async function fetchPubChemProperties(smiles: string) {
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/MolecularFormula,MolecularWeight,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount,ExactMass,MonoisotopicMass/JSON`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.PropertyTable?.Properties?.[0] || null;
  } catch {
    return null;
  }
}

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
    const { smiles, name } = await req.json();
    const query = smiles || name || '';

    // BUG FIX: only match by name when name is a non-empty string
    // Previously (name||'').toLowerCase() matched '' against every entry → always returned index 0
    const quinoneMatch = QUINONE_DATASET.find(
      (q) =>
        q.smiles.toLowerCase() === query.toLowerCase() ||
        (name && name.trim().length > 0 && q.name.toLowerCase().includes(name.toLowerCase()))
    );

    const pubchemProps = await fetchPubChemProperties(smiles || query);

    const result: Record<string, unknown> = {
      query,
      smiles,
      inDataset: !!quinoneMatch,
    };

    if (quinoneMatch) {
      result.dftData = {
        name: quinoneMatch.name,
        smiles: quinoneMatch.smiles,
        homo_ev: quinoneMatch.homo,
        lumo_ev: quinoneMatch.lumo,
        homo_lumo_gap_ev: quinoneMatch.gap,
        family: quinoneMatch.family,
        level_of_theory: 'DFT B3LYP/6-31G*',
      };
    } else if (smiles && smiles.trim().length > 0) {
      // Unknown molecule: compute k-NN prediction from structural features
      result.predictedData = kNNPredict(smiles.trim());
    }

    if (pubchemProps) {
      result.pubchemProperties = pubchemProps;
    }

    return new Response(JSON.stringify(result), {
      status: 200,
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

