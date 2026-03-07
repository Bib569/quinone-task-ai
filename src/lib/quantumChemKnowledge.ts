export interface QCMethod { id:string; name:string; fullName:string; category:string; scaling:string; accuracy:string; description:string; math:string; benefits:string[]; limitations:string[]; bestFor:string[]; software:string[]; year?:number; }
export interface DFTFunctional { id:string; name:string; rung:1|2|3|4|5; rungName:string; hfx:string; description:string; strengths:string[]; weaknesses:string[]; bestFor:string[]; year?:number; }
export interface BasisSet { id:string; name:string; family:string; quality:string; description:string; bestFor:string[]; limitations:string[]; elementCoverage:string; }

export const QC_METHODS: QCMethod[] = [
  { id:'hf', name:'HF', fullName:'Hartree-Fock', category:'Wavefunction / Mean-Field', scaling:'O(N⁴)', accuracy:'Moderate — no correlation',
    description:'Single-determinant mean-field method. Each electron moves in the average field of all others. The HF limit captures exact exchange but zero correlation energy. Foundation of all post-HF methods.',
    math:'F̂φᵢ=εᵢφᵢ; E_HF=Σᵢεᵢ−½Σᵢⱼ(2Jᵢⱼ−Kᵢⱼ); E_corr=E_exact−E_HF<0. Secular equation FC=SCε solved iteratively (SCF).',
    benefits:['Exact exchange','Variational (E≥E_exact)','Foundation for post-HF','Fast for large systems'],
    limitations:['Zero electron correlation','Fails for bond breaking','Overestimates barriers','Poor dispersion'],
    bestFor:['Starting geometry','Reference for perturbation theory','Closed-shell ground states'],
    software:['Gaussian','ORCA','Psi4','Q-Chem','Molpro'], year:1930 },

  { id:'mp2', name:'MP2', fullName:'Møller-Plesset 2nd Order', category:'Wavefunction / Perturbation Theory', scaling:'O(N⁵)',
    accuracy:'Good — ~80-90% correlation',
    description:'Second-order perturbation correction to HF. Doubles excitations dominate. SCS-MP2 (spin-component scaled) and RI-MP2 (resolution of identity) variants widely used.',
    math:'E(2)=Σ_{abij}|⟨ij||ab⟩|²/(εᵢ+εⱼ−εₐ−εᵦ). Not variational. RI approximation: (ia|jb)≈Σ_P (ia|P)(P|Q)⁻¹(Q|jb).',
    benefits:['Affordable correlation','Analytic gradients','RI-MP2 ~10× faster','SCS-MP2 improves accuracy'],
    limitations:['Not variational','Diverges for small gaps','Poor for strongly correlated'],
    bestFor:['Non-covalent interactions','Thermochemistry','Medium molecules'],
    software:['ORCA','Gaussian','Psi4','Molpro','Q-Chem'], year:1934 },

  { id:'ccsd', name:'CCSD', fullName:'Coupled Cluster Singles & Doubles', category:'Wavefunction / Coupled Cluster', scaling:'O(N⁶)',
    accuracy:'High',
    description:'Exponential ansatz |Ψ⟩=exp(T̂)|Φ₀⟩ with T̂=T₁+T₂. Size-consistent and size-extensive. The workhorse single-reference correlated method.',
    math:'e^{T̂}|Φ₀⟩; T₁=Σᵢₐtᵢᵃτᵢᵃ; T₂=¼Σᵢⱼₐᵦtᵢⱼᵃᵇτᵢⱼᵃᵇ. Similarity-transformed H̄=e^{-T}He^{T}. BCH expansion terminates at 4-fold commutators.',
    benefits:['Size-consistent','Highly accurate','Analytic gradients','Gold standard reference'],
    limitations:['O(N⁶) expensive','Fails for multi-reference','Not variational'],
    bestFor:['Accurate molecular properties','Spectroscopy','Single-reference systems'],
    software:['ORCA','Gaussian','Psi4','Molpro','CFOUR'], year:1966 },

  { id:'ccsdt', name:'CCSD(T)', fullName:'CCSD with Perturbative Triples', category:'Wavefunction / Coupled Cluster', scaling:'O(N⁷)',
    accuracy:'Very High — "Gold Standard"',
    description:'"Gold standard of quantum chemistry." Non-iterative perturbative triples on top of CCSD. ~1 kJ/mol accuracy for well-behaved molecules. CCSD(T)/CBS is the benchmark protocol.',
    math:'E_CCSD(T)=E_CCSD+E(T); triples: E(T)=Σ_{abcijk}t̃ᵢⱼₖᵃᵇᶜWᵢⱼₖᵃᵇᶜ/Dᵢⱼₖᵃᵇᶜ. T₁ diagnostic: <0.02 for reliable results.',
    benefits:['Sub-kJ/mol accuracy','CBS extrapolation well-established','Universally available'],
    limitations:['O(N⁷) limits to ~100 heavy atoms','Fails for multi-reference (T₁>0.02)'],
    bestFor:['Thermochemical benchmarks','Accurate barriers','W4 protocol'],
    software:['ORCA','Gaussian','Molpro','CFOUR','MRCC'], year:1989 },

  { id:'eomccsd', name:'EOM-CCSD', fullName:'Equation-of-Motion CCSD', category:'Wavefunction / Excited State', scaling:'O(N⁶)',
    accuracy:'High — ±0.1-0.3 eV for excitation energies',
    description:'Extends CCSD to excited states (EE), ionization (IP), electron attachment (EA), spin-flip (SF). Balanced description of ground and excited states.',
    math:'H̄R̂|Φ₀⟩=ΩR̂|Φ₀⟩; H̄=e^{-T}He^{T}; R̂=r₀+R₁+R₂. EE: excitation energy operator; IP: removes electron; EA: adds electron.',
    benefits:['Accurate excitation energies','All state types','Ionization potentials and electron affinities'],
    limitations:['Misses doubly-excited states','O(N⁶)'],
    bestFor:['UV-vis spectroscopy','Photoelectron spectra','Benchmark excitation energies'],
    software:['Q-Chem','ORCA','Gaussian','CFOUR'], year:1993 },

  { id:'casscf', name:'CASSCF', fullName:'Complete Active Space SCF', category:'Multi-Reference', scaling:'O(exp(n_act))',
    accuracy:'High for static correlation',
    description:'FCI within a selected active space + orbital optimization. CASSCF(n,m) = n electrons in m orbitals. Qualitatively correct for strongly correlated systems. Reference for CASPT2/NEVPT2.',
    math:'Ψ=Σ_I C_I|Φ_I⟩ (FCI in active space). ∂E/∂θ=0 for orbital rotation θ. State-averaging: E_avg=Σ_I w_I E_I.',
    benefits:['Handles bond breaking','Biradicals and diradicals','Photochemistry','Multi-state averaging'],
    limitations:['Misses dynamic correlation','Active space selection non-trivial','Exponential scaling'],
    bestFor:['Bond breaking','Transition metals','Conical intersections','Magnetic properties'],
    software:['Molpro','OpenMolcas','ORCA','Gaussian'], year:1980 },

  { id:'caspt2', name:'CASPT2', fullName:'CAS 2nd-Order Perturbation Theory', category:'Multi-Reference', scaling:'O(N⁵)',
    accuracy:'Very High',
    description:'Adds dynamic correlation to CASSCF via 2nd-order PT. Workhorse for photochemistry. IPEA shift corrects systematic errors. MS-CASPT2 for near-degenerate states.',
    math:'E=E_CASSCF+E(2); H₀=Ĝ (Fock-like); E(2)=⟨Ψ⁰|Ĥ₁|Ψ¹⟩. IPEA shift ε_IPEA=0.25 Eₕ standard.',
    benefits:['±0.1-0.2 eV excitation energies','All excited state types','Photochemistry standard'],
    limitations:['Intruder states require shifts','Active space selection','Not black-box'],
    bestFor:['Organic photochemistry','TM excited states','Spin-forbidden transitions'],
    software:['OpenMolcas','Molpro'], year:1990 },

  { id:'nevpt2', name:'NEVPT2', fullName:'N-Electron Valence PT2', category:'Multi-Reference', scaling:'O(N⁵)',
    accuracy:'Very High',
    description:'Multi-reference PT2 alternative to CASPT2. Uses Dyall Hamiltonian — intruder-state free. PC-NEVPT2 (partially contracted) and SC-NEVPT2 (strongly contracted) variants.',
    math:'E=Σ_μ⟨Ψ⁰|H|Ψ_μ^(1)⟩/(E_μ⁰−E₀⁰). Dyall H₀=Ĥcore+Ĥact+Ĥvirt ensures correct limits.',
    benefits:['No intruder states','More rigorous than CASPT2','ORCA implementation accessible'],
    limitations:['Slightly less accurate than CASPT2 in some benchmarks'],
    bestFor:['Multi-reference systems','Magnetic properties','Zero-field splitting'],
    software:['ORCA','Molpro','PySCF'], year:1999 },

  { id:'tddft', name:'TD-DFT', fullName:'Time-Dependent DFT', category:'DFT / Excited States', scaling:'O(N²-N³)×states',
    accuracy:'Good — ±0.2-0.5 eV for valence excitations',
    description:'Linear-response TD-DFT via Casida equation. Runge-Gross theorem (1984): time-dependent density uniquely determines time-dependent potential. Most widely used excited-state method for large molecules.',
    math:'Casida: (A B; B* A*)(X;Y)=ω(1 0; 0 -1)(X;Y); A_{ia,jb}=δᵢⱼδₐᵦ(εₐ−εᵢ)+2K_{ia,jb}+K_{ia,bj}; TDA: B=0.',
    benefits:['Large molecules','UV-vis and CD spectra','Analytic gradients','Widely implemented'],
    limitations:['CT states wrong with LDA/GGA (use RSH)','No doubly-excited states','Rydberg states need diffuse+RSH'],
    bestFor:['UV-vis spectra','Fluorescence','Organic chromophores','CD spectra'],
    software:['Gaussian','ORCA','Q-Chem','NWChem','Turbomole'], year:1984 },

  { id:'gw', name:'GW', fullName:'GW Many-Body Perturbation Theory', category:'Many-Body / Quasiparticle', scaling:'O(N³-N⁴)',
    accuracy:'High for quasiparticle energies',
    description:'Self-energy Σ=iGW (Green function × screened interaction). Accurate ionization potentials, electron affinities, and fundamental gaps. G₀W₀ single-shot to self-consistent scGW.',
    math:'Σ(r,r\';ω)=i/2π∫G(r,r\';ω\')W(r,r\';ω−ω\')dω\'; W=ε⁻¹v; εᵢⱼQP=εᵢⱼKS+⟨i|Σ(εQP)−vxc|j⟩.',
    benefits:['Accurate band gaps','Correct quasiparticle spectrum','First-principles IP/EA'],
    limitations:['Expensive','Starting-point dependent in G₀W₀'],
    bestFor:['Band gaps of semiconductors','Photoelectron spectra','IP/EA for organic molecules'],
    software:['TURBOMOLE','BerkeleyGW','WEST','FHI-aims','VASP'], year:1965 },

  { id:'bse', name:'BSE', fullName:'Bethe-Salpeter Equation', category:'Many-Body / Optical Spectra', scaling:'O(N⁴)',
    accuracy:'High — correct excitonic effects',
    description:'Two-particle equation for electron-hole interaction on top of GW. Correct excitonic effects. Essential for optical spectra of solids and CT excitations.',
    math:'L=L₀+L₀KL; kernel K=−iδΣ/δG includes screened exchange W.',
    benefits:['Correct excitonic binding','CT excitations','Optical spectra of solids'],
    limitations:['Very expensive','Requires GW input'],
    bestFor:['Semiconductor optics','Organic photovoltaics','Exciton binding energies'],
    software:['BerkeleyGW','ABINIT','Yambo'], year:1951 },

  { id:'dmc', name:'DMC', fullName:'Diffusion Monte Carlo', category:'Quantum Monte Carlo', scaling:'O(N³)×samples',
    accuracy:'Very High — near-exact with good nodes',
    description:'Projects ground state via imaginary-time evolution. Fixed-node approximation avoids sign problem. Near-FCI accuracy for large systems. Massively parallelizable.',
    math:'−∂Ψ/∂τ=(Ĥ−E_T)Ψ; importance sampling with trial Ψ_T. Fixed-node: Ψ=0 on nodes of Ψ_T.',
    benefits:['Near-FCI accuracy','Treats large strongly correlated systems','Massively parallel'],
    limitations:['Fixed-node error','Not deterministic','Expensive per sample'],
    bestFor:['Large strongly correlated systems','Solids','High-pressure phases'],
    software:['QMCPACK','Casino','TurboRVB'], year:1980 },

  { id:'gfn2xtb', name:'GFN2-xTB', fullName:'GFN2 Extended Tight Binding', category:'Semi-Empirical', scaling:'O(N²)→O(N)',
    accuracy:'Moderate — good structures/frequencies',
    description:'Grimme semi-empirical tight-binding DFT. Excellent for geometries, frequencies, non-covalent interactions. Enables CREST conformer generation and large-scale MD.',
    math:'E=E_EHT+E_IES+E_IXC+E_disp(D4)+E_rep. Mulliken-based charges, extended VSTO basis.',
    benefits:['Extremely fast','Good non-covalent interactions','Wide element coverage (Z=1-86)','CREST conformer generation'],
    limitations:['Less accurate energetics than DFT','Not for excited states'],
    bestFor:['Conformer sampling','Large-system pre-optimization','Drug-like molecules >1000 atoms'],
    software:['xtb','CREST','ORCA'], year:2019 },

  { id:'dftbu', name:'DFT+U', fullName:'DFT+U (Hubbard correction)', category:'DFT / Strongly Correlated', scaling:'O(N³)',
    accuracy:'Good for correlated d/f systems',
    description:'Adds on-site Hubbard U correction to DFT exchange-correlation to fix delocalization error in correlated d/f electrons. DFT+U (Liechtenstein/Dudarev) essential for transition metal oxides.',
    math:'E_{DFT+U}=E_{DFT}+U_eff/2×Σ_I Σ_σ Tr[n^{Iσ}(1−n^{Iσ})]; U_eff=U−J.',
    benefits:['Fixes delocalization in TM oxides','Computationally cheap correction','Essential for magnetic insulators'],
    limitations:['U parameter empirical','Double counting approximation','Not transferable'],
    bestFor:['TM oxides (NiO, FeO, CoO)','Rare-earth compounds','Correlated insulator band gaps'],
    software:['VASP','Quantum ESPRESSO','ABINIT'], year:1991 },

  { id:'qmmm', name:'QM/MM', fullName:'Quantum Mechanics / Molecular Mechanics', category:'Embedding', scaling:'O(N³_{QM})×O(N_{MM})',
    accuracy:'Depends on QM method used',
    description:'Treats reactive region with QM (DFT, CCSD) and environment with classical MM force field. ONIOM (Gaussian) uses multiple QM layers. Link atoms or frozen density embedding for QM/MM boundary.',
    math:'E_ONIOM=E_QM(model)+E_MM(real)−E_MM(model). Electrostatic embedding: adds MM point charges to QM Hamiltonian.',
    benefits:['Treats large biomolecular environments','Enzyme catalysis','Solvation effects with explicit atoms'],
    limitations:['QM/MM boundary artifacts','Force field quality in MM region','Link atom treatment'],
    bestFor:['Enzyme reactions','Drug binding','Photoproteins','Solvated molecules'],
    software:['Gaussian (ONIOM)','ORCA+AMBER','ChemShell','Q-Chem'], year:1976 },
];

export const DFT_FUNCTIONALS: DFTFunctional[] = [
  // Rung 1: LDA
  { id:'svwn', name:'SVWN / LDA', rung:1, rungName:'LDA (Local Density Approximation)', hfx:'0%',
    description:'Slater exchange + VWN correlation. Based on uniform electron gas. Simplest functional. Severely overbinds but correct qualitative physics.',
    strengths:['Very fast','Qualitatively correct for metals','Good for NMR shieldings'], weaknesses:['Overbinding ~30 kcal/mol','Wrong bond lengths','Fails for weak interactions'],
    bestFor:['Quick surveys','Solid-state qualitative','Orbital visualization'], year:1951 },

  // Rung 2: GGA
  { id:'pbe', name:'PBE', rung:2, rungName:'GGA (Generalized Gradient Approximation)', hfx:'0%',
    description:'Non-empirical Perdew-Burke-Ernzerhof GGA. Standard in solid-state DFT. Enhancement factor depends on ∇ρ. Most cited functional in physics.',
    strengths:['Non-empirical','Good for solids/surfaces','Fast'], weaknesses:['Overestimates bond lengths slightly','Poor dispersion','Delocalization error'],
    bestFor:['Solids and surfaces','Large systems','MD simulations'], year:1996 },

  { id:'blyp', name:'BLYP', rung:2, rungName:'GGA', hfx:'0%',
    description:'Becke88 exchange + Lee-Yang-Parr correlation. Popular for organic chemistry before hybrids. Part of B3LYP lineage.',
    strengths:['Good for organic molecules','Reasonable geometries'], weaknesses:['No HF exchange','Poor for kinetics','Underestimates reaction barriers'],
    bestFor:['Organic ground-state geometry','Historical comparison'], year:1988 },

  { id:'bp86', name:'BP86', rung:2, rungName:'GGA', hfx:'0%',
    description:'Becke88 exchange + Perdew86 correlation. Popular in German school (Turbomole). Good for vibrational frequencies of TM complexes.',
    strengths:['Good TM geometries','Good frequencies'], weaknesses:['No HF exchange','Dispersion missing'],
    bestFor:['Transition metal complexes','Vibrational spectroscopy'], year:1986 },

  { id:'pw91', name:'PW91', rung:2, rungName:'GGA', hfx:'0%',
    description:'Perdew-Wang 1991 GGA. Predecessor to PBE. Still used in some solid-state codes.',
    strengths:['Good for solids'], weaknesses:['Superseded by PBE in most contexts'],
    bestFor:['Historical comparison','Some solid-state applications'], year:1991 },

  { id:'pbesol', name:'PBEsol', rung:2, rungName:'GGA', hfx:'0%',
    description:'PBE revised for solids and surfaces. Better lattice constants than PBE for solids by restoring gradient expansion behavior.',
    strengths:['Better lattice constants than PBE','Accurate solid-state geometries'], weaknesses:['Worse for molecules than PBE'],
    bestFor:['Crystal structure optimization','Surface energies'], year:2008 },

  // Rung 3: meta-GGA
  { id:'tpss', name:'TPSS', rung:3, rungName:'meta-GGA', hfx:'0%',
    description:'Tao-Perdew-Staroverov-Scuseria meta-GGA. Depends on kinetic energy density τ. Non-empirical. Significant improvement over GGA for atomization energies.',
    strengths:['Non-empirical','Better atomization energies than GGA','Self-interaction-free in one-electron limit'],
    weaknesses:['No HF exchange','Still underestimates barriers'],
    bestFor:['Molecular geometries','Thermochemistry (better than GGA)'], year:2003 },

  { id:'m06l', name:'M06-L', rung:3, rungName:'meta-GGA', hfx:'0%',
    description:'Minnesota meta-GGA by Zhao & Truhlar. Highly parameterized for thermochemistry, kinetics, and non-covalent interactions. Only meta-GGA in Minnesota family.',
    strengths:['Best meta-GGA for thermochemistry','Good dispersion capture','Fast (no HF exchange)'],
    weaknesses:['Heavily parameterized','Numerical integration sensitivity'],
    bestFor:['Large molecules needing meta-GGA speed','Transition metal thermochemistry','Non-covalent interactions'], year:2006 },

  { id:'scan', name:'SCAN', rung:3, rungName:'meta-GGA', hfx:'0%',
    description:'Strongly Constrained and Appropriately Normed. Satisfies all 17 known exact constraints for a meta-GGA. Excellent for both molecules and solids.',
    strengths:['17 exact constraints satisfied','Accurate for both molecules and solids','Good for water/ice'],
    weaknesses:['Numerical issues with some implementations','Self-interaction error present'],
    bestFor:['Water and hydrogen-bonded systems','Strongly correlated oxides','Balanced molecule/solid description'], year:2015 },

  { id:'r2scan', name:'r²SCAN', rung:3, rungName:'meta-GGA', hfx:'0%',
    description:'Regularized SCAN — removes numerical issues while maintaining constraint satisfaction. Drop-in replacement for SCAN with improved convergence.',
    strengths:['SCAN accuracy without convergence problems','Efficient'], weaknesses:['Slightly fewer constraints than SCAN'],
    bestFor:['Large-scale DFT replacing SCAN','Molecular and solid-state calculations'], year:2020 },

  // Rung 4a: Global Hybrid
  { id:'b3lyp', name:'B3LYP', rung:4, rungName:'Global Hybrid', hfx:'20%',
    description:'Most widely used functional in chemistry. 3-parameter Becke hybrid with 20% HF exchange, Becke88 exchange, LYP correlation. Excellent for organic thermochemistry. Benchmark standard for organic chemistry 1993-present.',
    strengths:['Excellent organic thermochemistry','Bond lengths/angles','Widely benchmarked','Huge literature base'],
    weaknesses:['Underestimates barriers','Poor dispersion','CT excitations wrong in TDDFT','Fails for some TM systems'],
    bestFor:['Organic molecule properties','Geometry optimization','Vibrational frequencies','NMR chemical shifts'], year:1993 },

  { id:'pbe0', name:'PBE0', rung:4, rungName:'Global Hybrid', hfx:'25%',
    description:'25% HF exchange + 75% PBE. Non-empirical hybrid. Excellent balance for a wide range of properties. Standard for solid-state hybrid DFT (HSE06 is range-separated variant).',
    strengths:['Non-empirical','Good for both molecules and solids','Accurate TM properties'],
    weaknesses:['More expensive than GGA','CT excitations still problematic'],
    bestFor:['General-purpose molecular chemistry','Periodic calculations (costly)','Accurate atomization energies'], year:1999 },

  { id:'m062x', name:'M06-2X', rung:4, rungName:'Global Hybrid', hfx:'54%',
    description:'Minnesota hybrid with 54% HF exchange. Excellent for main-group thermochemistry, kinetics, and non-covalent interactions. Not recommended for TM chemistry.',
    strengths:['Excellent barriers and kinetics','Non-covalent interactions','Best for organic main-group'],
    weaknesses:['Fails for TM complexes','Heavily parameterized','Not for multi-reference'],
    bestFor:['Organic reaction barriers','Non-covalent interactions','Drug-like molecule conformations'], year:2008 },

  { id:'b3pw91', name:'B3PW91', rung:4, rungName:'Global Hybrid', hfx:'20%',
    description:'Becke 3-parameter hybrid with PW91 correlation. Often comparable to B3LYP, sometimes better for TM chemistry.',
    strengths:['Good TM properties','Historical importance'], weaknesses:['Largely superseded by B3LYP/PBE0'],
    bestFor:['TM complexes when B3LYP underperforms'], year:1993 },

  { id:'tpssh', name:'TPSSh', rung:4, rungName:'Global Hybrid meta-GGA', hfx:'10%',
    description:'10% HF exchange added to TPSS meta-GGA. Good for TM complexes. More accurate geometries than B3LYP for metals.',
    strengths:['Good for TM geometries','Non-empirical design'], weaknesses:['Less accurate thermochemistry than B3LYP'],
    bestFor:['Transition metal complex geometries','Mössbauer spectroscopy'], year:2003 },

  { id:'m06hf', name:'M06-HF', rung:4, rungName:'Global Hybrid', hfx:'100%',
    description:'100% HF exchange. Correct long-range behavior. Eliminates self-interaction. Useful for Rydberg states and long-range CT.',
    strengths:['Correct CT asymptote','No self-interaction in HF sense'],
    weaknesses:['Overkill for most properties','Poor for normal thermochemistry'],
    bestFor:['Long-range charge transfer','Rydberg excitations'], year:2006 },

  // Rung 4b: Range-Separated Hybrid
  { id:'cam-b3lyp', name:'CAM-B3LYP', rung:4, rungName:'Range-Separated Hybrid (RSH)', hfx:'19% SR → 65% LR',
    description:'Coulomb-attenuating method. Short-range: 19% HF, Long-range: 65% HF. Correction to B3LYP for CT excitations. Standard RSH for TD-DFT charge-transfer states.',
    strengths:['Correct CT excitation energies','Good Rydberg states','Improved dispersion vs B3LYP'],
    weaknesses:['Slightly worse ground-state thermochemistry than B3LYP'],
    bestFor:['Charge-transfer UV-vis spectra','Push-pull chromophores','Rydberg excitations','Organic solar cells'], year:2004 },

  { id:'wb97xd', name:'ωB97X-D', rung:4, rungName:'Range-Separated Hybrid (RSH)', hfx:'22% SR → 100% LR',
    description:'Range-separated hybrid with empirical dispersion (D2). Long-range: 100% HF exchange. Excellent for non-covalent interactions and CT excitations.',
    strengths:['Best RSH for non-covalent interactions','Correct CT excitations','Dispersion included'],
    weaknesses:['Empirical parameters','Slightly over-corrects some dispersion'],
    bestFor:['Supramolecular chemistry','π-stacking','Host-guest interactions','TD-DFT of organic chromophores'], year:2008 },

  { id:'wb97xv', name:'ωB97X-V', rung:4, rungName:'Range-Separated Hybrid + VV10', hfx:'16.7% SR → 100% LR',
    description:'RSH with non-local VV10 dispersion. Considered best RSH for non-covalent interactions by many benchmarks.',
    strengths:['Excellent non-covalent interactions','Non-local dispersion more physical'], weaknesses:['Expensive dispersion kernel'],
    bestFor:['Non-covalent complexes','Liquid-phase simulations'], year:2014 },

  { id:'wb97mv', name:'ωB97M-V', rung:4, rungName:'Range-Separated meta-GGA Hybrid + VV10', hfx:'15% SR → 100% LR',
    description:'Combines RSH with meta-GGA and non-local VV10 dispersion. One of the most accurate functionals for broad properties.',
    strengths:['Best overall accuracy in many benchmarks','Non-local dispersion','meta-GGA kinetic energy density'],
    weaknesses:['Complex functional form','Expensive'],
    bestFor:['High-accuracy DFT','General purpose when best accuracy needed'], year:2016 },

  { id:'hse06', name:'HSE06', rung:4, rungName:'Screened-Exchange Hybrid (RSH)', hfx:'25% SR → 0% LR',
    description:'Heyd-Scuseria-Ernzerhof screened-exchange functional. HF exchange only at short range (screened). Computationally tractable for periodic systems unlike PBE0.',
    strengths:['Tractable for solids','Good band gaps','Accurate for semiconductors'],
    weaknesses:['Short-range only HF exchange','Worse for molecules than PBE0'],
    bestFor:['Semiconductor band gaps','Metallic systems with hybrid DFT','Surface reactions on metals'], year:2006 },

  { id:'lc-pbe', name:'LC-ωPBE', rung:4, rungName:'Long-Range Corrected RSH', hfx:'0% SR → 100% LR',
    description:'Long-range corrected PBE. 100% HF at long range, 0% at short range. Correct −1/r asymptote. Good for charge-transfer and Rydberg states.',
    strengths:['Correct asymptotic behavior','Good for ionization potentials'],
    weaknesses:['Tuning of ω sometimes needed'], bestFor:['IP calculations','CT excitations'], year:2006 },

  // Rung 5: Double Hybrid
  { id:'b2plyp', name:'B2-PLYP', rung:5, rungName:'Double Hybrid', hfx:'53%',
    description:'Grimme double hybrid: 53% HF exchange + MP2 correlation on top of DFT. Systematic improvement over hybrids. Near-CCSD(T) accuracy for main-group thermochemistry.',
    strengths:['Near-CCSD(T) accuracy','Better than hybrids for thermochemistry','SCS-B2-PLYP variant'],
    weaknesses:['O(N⁵) cost from MP2','Memory intensive','Not good for TM systems'],
    bestFor:['High-accuracy thermochemistry','Reaction energies and barriers','Supplement to CCSD(T)'], year:2006 },

  { id:'b2gpplyp', name:'B2GP-PLYP', rung:5, rungName:'Double Hybrid', hfx:'65%',
    description:'General purpose B2-PLYP reparameterization by Karton. More accurate than B2-PLYP for many properties including kinetics.',
    strengths:['Best double hybrid for general use','Accurate kinetics'],
    weaknesses:['Same O(N⁵) cost'], bestFor:['Thermochemistry','Barrier heights'], year:2008 },

  { id:'dsd-blyp', name:'DSD-BLYP-D3', rung:5, rungName:'Double Hybrid + Dispersion', hfx:'69%',
    description:'Spin-component scaled (SCS) double hybrid with D3 dispersion. Top performer for non-covalent interactions at double-hybrid level.',
    strengths:['Excellent non-covalent interactions','SCS reduces MP2 overfitting'],
    weaknesses:['Expensive'], bestFor:['Non-covalent complexes','π-stacking','H-bonds at highest DFT accuracy'], year:2011 },
];

export const BASIS_SETS: BasisSet[] = [
  // Minimal
  { id:'sto3g', name:'STO-3G', family:'Minimal (STO)', quality:'Minimal',
    description:'3 Gaussian functions per Slater-type orbital. Minimal basis. Only for qualitative results. Fast.',
    bestFor:['Teaching','Very large systems qualitatively','Preoptimization'], limitations:['Poor accuracy','No polarization','Not for publication'], elementCoverage:'H-Xe' },

  // Pople split-valence
  { id:'321g', name:'3-21G', family:'Pople Split-Valence', quality:'DZ (no polarization)',
    description:'Core: 3 Gaussians; valence inner: 2, outer: 1. Minimal useful for geometry.',
    bestFor:['Quick geometry checks','Starting geometries'], limitations:['No polarization','Poor for anions/excited states'], elementCoverage:'H-Xe' },

  { id:'631gs', name:'6-31G*', family:'Pople Split-Valence', quality:'DZ + polarization (heavy atoms)',
    description:'6 Gaussians for core, 3+1 split valence, d polarization on heavy atoms. Workhorse Pople basis for organic chemistry.',
    bestFor:['Organic geometry optimization','HF/DFT ground state','Historical DFT calculations'], limitations:['Poor for anions without +','Insufficient for accurate thermochemistry'], elementCoverage:'H-Zn' },

  { id:'631gss', name:'6-31G**', family:'Pople Split-Valence', quality:'DZ + polarization (all atoms)',
    description:'Adds p polarization on H compared to 6-31G*.',
    bestFor:['H-bond geometry','Proton transfer reactions'], limitations:['As 6-31G*'], elementCoverage:'H-Zn' },

  { id:'631plusgs', name:'6-31+G*', family:'Pople Split-Valence', quality:'DZ + polarization + diffuse',
    description:'Adds diffuse s and p functions on heavy atoms. Essential for anions, lone pairs, and excited states.',
    bestFor:['Anions','Electron affinities','Excited states in TDDFT'], limitations:['Linear dependence for large systems'], elementCoverage:'H-Zn' },

  { id:'6311plusg2df', name:'6-311+G(2d,p)', family:'Pople Triple-Zeta', quality:'TZ + diffuse + polarization',
    description:'Triple-zeta valence with diffuse and multiple polarization. Standard for accurate energetics with DFT.',
    bestFor:['Accurate energetics','NMR chemical shifts','Electron affinities'], limitations:['Slow for large systems'], elementCoverage:'H-Zn' },

  // Dunning cc
  { id:'ccpvdz', name:'cc-pVDZ', family:'Dunning Correlation-Consistent', quality:'DZ',
    description:'Correlation-consistent polarized valence DZ. Designed for post-HF CBS extrapolation. Hierarchy: DZ→TZ→QZ→5Z→CBS.',
    bestFor:['Post-HF starting point','MP2 geometry'], limitations:['Insufficient for accurate energetics alone — extrapolate to CBS'], elementCoverage:'H-Kr' },

  { id:'ccpvtz', name:'cc-pVTZ', family:'Dunning Correlation-Consistent', quality:'TZ',
    description:'Triple-zeta correlation-consistent. Standard for CCSD(T) energy calculations. Pair with cc-pVQZ for CBS extrapolation.',
    bestFor:['CCSD(T) energetics','MP2 with CBS','Accurate molecular properties'], limitations:['Expensive for large systems'], elementCoverage:'H-Kr' },

  { id:'augccpvtz', name:'aug-cc-pVTZ', family:'Dunning Augmented', quality:'TZ + diffuse',
    description:'cc-pVTZ augmented with diffuse functions on all atoms. Essential for anions, Rydberg states, and polarizabilities.',
    bestFor:['Anion properties','Polarizabilities','Rydberg excitations','Accurate EA'], limitations:['Very expensive','Linear dependence risk'], elementCoverage:'H-Kr' },

  { id:'ccpvqz', name:'cc-pVQZ', family:'Dunning Correlation-Consistent', quality:'QZ',
    description:'Quadruple-zeta. Used with cc-pVTZ for Helgaker CBS extrapolation: E_CBS = (Q³E_Q − T³E_T)/(Q³−T³).',
    bestFor:['CBS extrapolation','Sub-kJ/mol thermochemistry'], limitations:['Extremely expensive'], elementCoverage:'H-Kr' },

  { id:'ccpcvtz', name:'cc-pCVTZ', family:'Dunning Core-Valence', quality:'TZ + core',
    description:'cc-pVTZ augmented with core-correlating functions. Needed for accurate geometries and properties when core correlation is important.',
    bestFor:['Accurate molecular geometries','Core-level properties','NMR coupling constants'], limitations:['Expensive'], elementCoverage:'H-Kr' },

  // Karlsruhe def2
  { id:'def2svp', name:'def2-SVP', family:'Karlsruhe (def2)', quality:'DZ + polarization',
    description:'Split-valence polarized. Efficient and balanced. ECPs for heavy elements (Z>36). Standard in ORCA for routine DFT.',
    bestFor:['Routine DFT geometry','Large molecules','Quick DFT calculations'], limitations:['Insufficient for accurate energetics'], elementCoverage:'H-Rn (ECP for heavy)' },

  { id:'def2tzvp', name:'def2-TZVP', family:'Karlsruhe (def2)', quality:'TZ + polarization',
    description:'Triple-zeta valence polarized. Recommended for production-quality DFT calculations. Balance of accuracy and cost.',
    bestFor:['Production DFT single-points','Accurate geometries','NMR','Excited states'], limitations:['Expensive for >100 atoms'], elementCoverage:'H-Rn (ECP for Z>36)' },

  { id:'def2tzvpp', name:'def2-TZVPP', family:'Karlsruhe (def2)', quality:'TZ + 2×polarization',
    description:'Two sets of polarization functions. Better for response properties.',
    bestFor:['Polarizabilities','NMR shieldings','Raman spectra'], limitations:['More expensive than def2-TZVP'], elementCoverage:'H-Rn' },

  { id:'def2qzvp', name:'def2-QZVP', family:'Karlsruhe (def2)', quality:'QZ + polarization',
    description:'Quadruple-zeta for near-complete basis DFT. Near-CBS for DFT.',
    bestFor:['Near-CBS DFT single-points','Benchmark calculations'], limitations:['Very expensive'], elementCoverage:'H-Rn' },

  { id:'def2svpd', name:'def2-SVPD', family:'Karlsruhe (def2)', quality:'DZ + diffuse',
    description:'def2-SVP augmented with diffuse functions. Anions and excited states at reasonable cost.',
    bestFor:['DFT/TDDFT of anions','Excited states at lower cost'], limitations:['Less accurate than def2-TZVPD'], elementCoverage:'H-Rn' },

  { id:'def2tzvpd', name:'def2-TZVPD', family:'Karlsruhe (def2)', quality:'TZ + diffuse',
    description:'def2-TZVP with diffuse functions. Standard for TDDFT and anionic species.',
    bestFor:['TDDFT excited states','EA calculations','Rydberg states'], limitations:['Expensive'], elementCoverage:'H-Rn' },

  // Jensen pc-n
  { id:'pc1', name:'pc-1', family:'Jensen Polarization-Consistent', quality:'DZ (optimized for DFT)',
    description:'Polarization-consistent DZ optimized specifically for DFT convergence. Jensen series converges faster to DFT CBS than Dunning.',
    bestFor:['DFT CBS extrapolation','Property calculations'], limitations:['Less common than Dunning/def2'], elementCoverage:'H-Ar' },

  { id:'pc2', name:'pc-2', family:'Jensen Polarization-Consistent', quality:'TZ',
    description:'Triple-zeta Jensen basis optimal for DFT. Recommended for DFT CBS.',
    bestFor:['Accurate DFT properties','CBS extrapolation for DFT'], limitations:['Limited element coverage'], elementCoverage:'H-Ar' },

  // Relativistic / ECP
  { id:'lanl2dz', name:'LANL2DZ', family:'Effective Core Potential (ECP)', quality:'DZ valence',
    description:'Los Alamos ECP + DZ valence basis. Replaces core electrons with pseudopotential. Standard for heavy metal calculations.',
    bestFor:['Heavy metals (3d, 4d, 5d)','Relativistic effects implicitly','Large TM complexes'], limitations:['ECP approximation','Poor for core properties'], elementCoverage:'K-Bi' },

  { id:'sdd', name:'SDD', family:'ECP (Stuttgart-Dresden)', quality:'DZ-TZ valence',
    description:'Stuttgart-Dresden small-core ECPs. Better than LANL2DZ for heavy elements.',
    bestFor:['Lanthanides and actinides','Heavy 4d/5d transition metals'], limitations:['ECP approximation'], elementCoverage:'K-Cm' },

  // Plane-wave / Periodic
  { id:'planewave', name:'Plane Waves', family:'Plane Wave (Periodic)', quality:'Determined by cutoff (Ry/eV)',
    description:'Complete orthonormal basis for periodic systems. Cutoff energy determines completeness. PAW (projector augmented wave) or ultrasoft pseudopotentials used with valence-only PW.',
    bestFor:['Periodic solid-state DFT','Surfaces and slabs','Phonons and band structure'], limitations:['Not for isolated molecules (need large cell)','Pseudopotential needed for core'], elementCoverage:'All elements with appropriate pseudopotentials' },
];

export const KEY_EQUATIONS = [
  { name: 'Schrödinger Equation', eq: 'ĤΨ = EΨ', description: 'Foundation of quantum mechanics. H=T+V. Time-independent for stationary states. Full many-body version exponentially hard to solve exactly.' },
  { name: 'HF Energy', eq: 'E_HF = ⟨Φ|Ĥ|Φ⟩ = Σᵢhᵢᵢ + ½Σᵢⱼ(2Jᵢⱼ−Kᵢⱼ)', description: 'Single Slater determinant energy. J=Coulomb, K=exchange. Correlation energy = E_exact − E_HF < 0.' },
  { name: 'KS-DFT Total Energy', eq: 'E[ρ] = Ts[ρ] + J[ρ] + Exc[ρ] + ∫v_ext(r)ρ(r)dr', description: 'Kohn-Sham DFT. Ts=non-interacting KE, J=Hartree, Exc=exchange-correlation (unknown exact form), v_ext=nuclear potential.' },
  { name: 'KS Equations', eq: '(−½∇² + v_KS[ρ])φᵢ = εᵢφᵢ; ρ(r)=Σᵢ|φᵢ(r)|²', description: 'Self-consistent one-electron equations. v_KS = v_ext + v_J + v_xc where v_xc = δExc/δρ.' },
  { name: 'TD-DFT Casida Equation', eq: '(A B; B* A*)(X;Y) = ω(1 0; 0 −1)(X;Y)', description: 'Linear-response TD-DFT eigenvalue problem. ω=excitation energy. A_{ia,jb}=δ_{ij}δ_{ab}(ε_a−εᵢ)+K_{ia,jb}. Oscillator strength f∝ΔE|transition dipole|².' },
  { name: 'MP2 Correlation', eq: 'E(2) = Σ_{abij}|⟨ij||ab⟩|²/(εᵢ+εⱼ−εₐ−εᵦ)', description: 'Second-order Møller-Plesset energy. Denominator = orbital energy differences. Double excitations ij→ab dominate.' },
  { name: 'Coupled Cluster Ansatz', eq: '|Ψ⟩ = e^{T̂}|Φ₀⟩; T̂=T₁+T₂+T₃+...', description: 'Exponential wavefunction parameterization. Guarantees size-consistency. BCH expansion of e^{-T}He^{T} terminates exactly at 4-fold commutators for 2-body H.' },
  { name: 'HOMO-LUMO Gap (Koopmans)', eq: 'E_gap ≈ ε_LUMO − ε_HOMO', description: 'Orbital energy gap approximating optical/fundamental gap. Exact IP = −ε_HOMO (HF), approximate in DFT. Fundamental gap ≠ optical gap (excitonic binding).' },
  { name: 'GW Self-Energy', eq: 'Σ(r,r\';ω) = i/2π ∫G(r,r\';ω\')W(r,r\';ω−ω\')dω\'', description: 'Many-body self-energy: Green function G × screened interaction W. Corrects KS orbital energies to quasiparticle energies.' },
  { name: 'Hohenberg-Kohn Theorem', eq: 'E₀ = E[ρ₀] ≤ E[ρ] for all ρ≠ρ₀', description: 'Variational principle for the density. The ground-state energy is a unique functional of the electron density. The true ground-state density minimizes E[ρ].' },
  { name: 'Jacob\'s Ladder (DFT rungs)', eq: 'LDA→GGA→meta-GGA→hybrid→double-hybrid→(exact)', description: 'Hierarchy of DFT approximations. Each rung adds information: Rung2+∇ρ; Rung3+τ; Rung4+E_x^HF; Rung5+E_c^MP2. Accuracy improves with cost.' },
  { name: 'Heisenberg Uncertainty', eq: 'ΔxΔpₓ ≥ ℏ/2; ΔEΔt ≥ ℏ/2', description: 'Fundamental quantum mechanical uncertainty. Basis for zero-point energy, linewidth of spectral features, and tunneling.' },
];

export const SPECTROSCOPY_GUIDE = [
  { property: 'UV-Vis Absorption', method: 'TD-DFT (CAM-B3LYP or ωB97X-D / def2-TZVP)', notes: 'Use RSH for push-pull chromophores. Local excitations: B3LYP/6-31G* acceptable. Solvent effects: PCM/SMD.' },
  { property: 'Fluorescence / Emission', method: 'TD-DFT excited-state optimization + emission energy', notes: 'Optimize S₁ geometry at TD-DFT level. Stokes shift = E_abs − E_em. Phosphorescence: T₁ at TDDFT or CASPT2.' },
  { property: 'IR / Raman Frequencies', method: 'DFT harmonic frequencies (B3LYP or PBE0 / def2-TZVP)', notes: 'Scale factors: B3LYP/6-31G* → 0.961. Anharmonic corrections (VPT2) for accurate fundamentals.' },
  { property: 'NMR Chemical Shifts', method: 'B3LYP/6-311+G(2d,p) or PBE0/def2-TZVP with GIAO', notes: 'Reference TMS for ¹H and ¹³C. Solvent effects important. WC04 functional optimized for NMR.' },
  { property: 'Ionization Potential (vertical)', method: 'CCSD(T) or G4 // DFT geometry; or GW', notes: 'Koopmans theorem: IP ≈ −ε_HOMO (HF). ΔE approach: IP = E(N−1) − E(N).' },
  { property: 'Electron Affinity', method: 'CCSD(T) aug-cc-pVTZ or G4; aug basis critical', notes: 'Diffuse functions essential. EA = E(N) − E(N+1). Negative EA: unstable anion.' },
  { property: 'Reaction Barrier', method: 'M06-2X or ωB97X-D / def2-TZVP; confirm with CCSD(T)', notes: 'DFT underestimates barriers. M06-2X best hybrid for barriers. CCSD(T) for benchmark.' },
  { property: 'Non-covalent Interactions', method: 'ωB97X-D or B97-D3 or DLPNO-CCSD(T)', notes: 'BSSE correction (counterpoise). D3/D4 dispersion critical. SAPT analysis for interaction energy decomposition.' },
  { property: 'Transition Metal Properties', method: 'TPSSh, PBE0, or B3LYP* / def2-TZVP', notes: 'Spin state energetics: multireference often needed. CASPT2/NEVPT2 for spin gaps. DFT+U for oxides.' },
  { property: 'HOMO-LUMO Gap', method: 'B3LYP/6-31G* (screening); CCSD(T) or GW (accurate)', notes: 'KS gap systematically underestimates fundamental gap. Optical gap from TD-DFT. For quinones: B3LYP/6-31G* reliable.' },
];
