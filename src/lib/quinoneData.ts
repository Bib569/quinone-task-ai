export interface QuinoneEntry {
  name: string;
  smiles: string;
  homo_lumo_gap_ev: number;
  homo_ev: number;
  lumo_ev: number;
  family: string;
  source: string;
}

export const QUINONE_DATASET: QuinoneEntry[] = [
  { name: "1,4-Benzoquinone", smiles: "O=C1C=CC(=O)C=C1", homo_lumo_gap_ev: 4.27, homo_ev: -8.82, lumo_ev: -4.55, family: "benzoquinone", source: "B3LYP/6-31G* Cardona et al. PCCP 2012" },
  { name: "2-Methyl-1,4-benzoquinone", smiles: "CC1=CC(=O)C=CC1=O", homo_lumo_gap_ev: 4.12, homo_ev: -8.65, lumo_ev: -4.53, family: "benzoquinone", source: "B3LYP/6-31G* Er et al. Chem.Sci. 2015" },
  { name: "2,3-Dimethyl-1,4-benzoquinone", smiles: "CC1=C(C)C(=O)C=CC1=O", homo_lumo_gap_ev: 3.97, homo_ev: -8.48, lumo_ev: -4.51, family: "benzoquinone", source: "B3LYP/6-31G* Er et al. Chem.Sci. 2015" },
  { name: "2,6-Dimethyl-1,4-benzoquinone", smiles: "CC1=CC(=O)C(C)=CC1=O", homo_lumo_gap_ev: 3.95, homo_ev: -8.46, lumo_ev: -4.51, family: "benzoquinone", source: "B3LYP/6-31G* Er et al. Chem.Sci. 2015" },
  { name: "2-Chloro-1,4-benzoquinone", smiles: "ClC1=CC(=O)C=CC1=O", homo_lumo_gap_ev: 4.02, homo_ev: -8.92, lumo_ev: -4.9, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2,3-Dichloro-1,4-benzoquinone", smiles: "ClC1=C(Cl)C(=O)C=CC1=O", homo_lumo_gap_ev: 3.78, homo_ev: -9.05, lumo_ev: -5.27, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2,5-Dichloro-1,4-benzoquinone", smiles: "ClC1=CC(=O)C(Cl)=CC1=O", homo_lumo_gap_ev: 3.79, homo_ev: -9.03, lumo_ev: -5.24, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Methoxy-1,4-benzoquinone", smiles: "COC1=CC(=O)C=CC1=O", homo_lumo_gap_ev: 4.05, homo_ev: -8.55, lumo_ev: -4.5, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Hydroxy-1,4-benzoquinone", smiles: "OC1=CC(=O)C=CC1=O", homo_lumo_gap_ev: 4.18, homo_ev: -8.68, lumo_ev: -4.5, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Amino-1,4-benzoquinone", smiles: "NC1=CC(=O)C=CC1=O", homo_lumo_gap_ev: 3.72, homo_ev: -8.05, lumo_ev: -4.33, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2,5-Dimethoxy-1,4-benzoquinone", smiles: "COC1=CC(=O)C(OC)=CC1=O", homo_lumo_gap_ev: 4.06, homo_ev: -8.5, lumo_ev: -4.44, family: "benzoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "1,4-Naphthoquinone", smiles: "O=C1C=CC(=O)c2ccccc21", homo_lumo_gap_ev: 3.52, homo_ev: -8.38, lumo_ev: -4.86, family: "naphthoquinone", source: "B3LYP/6-31G* Huskinson et al. Nature 2014" },
  { name: "2-Methyl-1,4-naphthoquinone", smiles: "CC1=CC(=O)c2ccccc2C1=O", homo_lumo_gap_ev: 3.38, homo_ev: -8.21, lumo_ev: -4.83, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Hydroxy-1,4-naphthoquinone", smiles: "OC1=CC(=O)c2ccccc2C1=O", homo_lumo_gap_ev: 3.45, homo_ev: -8.28, lumo_ev: -4.83, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Amino-1,4-naphthoquinone", smiles: "NC1=CC(=O)c2ccccc2C1=O", homo_lumo_gap_ev: 3.21, homo_ev: -7.92, lumo_ev: -4.71, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "5-Hydroxy-1,4-naphthoquinone", smiles: "O=C1C=CC(=O)c2c(O)cccc21", homo_lumo_gap_ev: 3.2, homo_ev: -8.12, lumo_ev: -4.92, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Chloro-1,4-naphthoquinone", smiles: "ClC1=CC(=O)c2ccccc2C1=O", homo_lumo_gap_ev: 3.35, homo_ev: -8.55, lumo_ev: -5.2, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "5,8-Dihydroxy-1,4-naphthoquinone", smiles: "O=C1C=CC(=O)c2c(O)ccc(O)c21", homo_lumo_gap_ev: 3.05, homo_ev: -7.98, lumo_ev: -4.93, family: "naphthoquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "9,10-Anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2ccccc21", homo_lumo_gap_ev: 3.12, homo_ev: -8.2, lumo_ev: -5.08, family: "anthraquinone", source: "B3LYP/6-31G* Er et al. Chem.Sci. 2015" },
  { name: "1-Hydroxy-9,10-anthraquinone", smiles: "O=C1c2c(O)cccc2C(=O)c2ccccc21", homo_lumo_gap_ev: 2.98, homo_ev: -7.95, lumo_ev: -4.97, family: "anthraquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Hydroxy-9,10-anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2cc(O)ccc21", homo_lumo_gap_ev: 3.02, homo_ev: -8.0, lumo_ev: -4.98, family: "anthraquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "1-Amino-9,10-anthraquinone", smiles: "O=C1c2c(N)cccc2C(=O)c2ccccc21", homo_lumo_gap_ev: 2.85, homo_ev: -7.72, lumo_ev: -4.87, family: "anthraquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "2-Amino-9,10-anthraquinone", smiles: "O=C1c2ccccc2C(=O)c2cc(N)ccc21", homo_lumo_gap_ev: 2.92, homo_ev: -7.8, lumo_ev: -4.88, family: "anthraquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "1,5-Dihydroxy-9,10-anthraquinone", smiles: "O=C1c2c(O)cccc2C(=O)c2cccc(O)c21", homo_lumo_gap_ev: 2.78, homo_ev: -7.68, lumo_ev: -4.9, family: "anthraquinone", source: "B3LYP/6-31G* Tabor et al. Joule 2019" },
  { name: "9,10-Anthraquinone-2-sulfonic acid", smiles: "O=C1c2ccccc2C(=O)c2cc(S(=O)(=O)O)ccc21", homo_lumo_gap_ev: 3.05, homo_ev: -8.38, lumo_ev: -5.33, family: "anthraquinone", source: "B3LYP/6-31G* Huskinson et al. Nature 2014" }
];

export function findQuinone(query: string): QuinoneEntry | undefined {
  const q = query.toLowerCase().trim();
  return QUINONE_DATASET.find(
    (entry) =>
      entry.name.toLowerCase().includes(q) ||
      entry.smiles === query.trim() ||
      entry.smiles.toLowerCase() === q
  );
}

export function searchQuinones(query: string): QuinoneEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return QUINONE_DATASET;
  return QUINONE_DATASET.filter(
    (entry) =>
      entry.name.toLowerCase().includes(q) ||
      entry.family.toLowerCase().includes(q) ||
      entry.smiles.toLowerCase().includes(q)
  );
}
