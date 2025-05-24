// Données mockées pour simuler l'API
export const mockEnregistrements = [
  {
    id: 1,
    nom: "Diallo",
    prenom: "Amadou",
    tel: "612345678",
    statut: "entree",
    categorie_nom: "etudiant",
    plaque_immatricu: "AT-123ABC",
    type_engin: "Moto",
    date_entree: "2024-03-20T08:30:00",
    date_sortie: null,
    code_pin: "1234",
  },
  {
    id: 2,
    nom: "Sow",
    prenom: "Fatou",
    tel: "623456789",
    statut: "sortie",
    categorie_nom: "enseignant",
    plaque_immatricu: "AT-456DEF",
    type_engin: "Voiture",
    date_entree: "2024-03-20T09:15:00",
    date_sortie: "2024-03-20T17:30:00",
    code_pin: "5678",
  },
  {
    id: 3,
    nom: "Bah",
    prenom: "Mamadou",
    tel: "634567890",
    statut: "entree",
    categorie_nom: "personnel",
    plaque_immatricu: "AT-789GHI",
    type_engin: "Voiture",
    date_entree: "2024-03-20T10:00:00",
    date_sortie: null,
    code_pin: "9012",
  },
  {
    id: 4,
    nom: "Camara",
    prenom: "Aminata",
    tel: "645678901",
    statut: "entree",
    categorie_nom: "parent",
    plaque_immatricu: "AT-012JKL",
    type_engin: "Moto",
    date_entree: "2024-03-20T11:45:00",
    date_sortie: null,
    code_pin: "3456",
  },
  {
    id: 5,
    nom: "Keita",
    prenom: "Ibrahima",
    tel: "656789012",
    statut: "sortie",
    categorie_nom: "etudiant",
    plaque_immatricu: "AT-345MNO",
    type_engin: "Moto",
    date_entree: "2024-03-19T14:20:00",
    date_sortie: "2024-03-19T16:45:00",
    code_pin: "7890",
  },
];

// Fonctions utilitaires pour simuler les opérations API
export const mockAPI = {
  // Récupérer tous les enregistrements
  getAllEnregistrements: () => {
    return Promise.resolve(mockEnregistrements);
  },

  // Récupérer les enregistrements actifs (statut = entree)
  getActiveEnregistrements: () => {
    return Promise.resolve(
      mockEnregistrements.filter((e) => e.statut === "entree")
    );
  },

  // Ajouter un nouvel enregistrement
  addEnregistrement: (newEnregistrement) => {
    const id = Math.max(...mockEnregistrements.map((e) => e.id)) + 1;
    const enregistrement = {
      ...newEnregistrement,
      id,
      statut: "entree",
      date_entree: new Date().toISOString(),
      date_sortie: null,
      code_pin: Math.floor(1000 + Math.random() * 9000).toString(), // Génère un code PIN aléatoire
    };
    mockEnregistrements.push(enregistrement);
    return Promise.resolve(enregistrement);
  },

  // Valider une sortie
  validateSortie: (codePin) => {
    const enregistrement = mockEnregistrements.find(
      (e) => e.code_pin === codePin && e.statut === "entree"
    );
    if (enregistrement) {
      enregistrement.statut = "sortie";
      enregistrement.date_sortie = new Date().toISOString();
      return Promise.resolve(enregistrement);
    }
    return Promise.reject(
      new Error("Code PIN invalide ou véhicule déjà sorti")
    );
  },

  // Rechercher par code PIN
  searchByCodePin: (codePin) => {
    const enregistrement = mockEnregistrements.find(
      (e) => e.code_pin === codePin
    );
    return Promise.resolve(enregistrement || null);
  },

  // Obtenir l'historique par date
  getHistoriqueByDate: (date) => {
    const dateStr = new Date(date).toISOString().split("T")[0];
    return Promise.resolve(
      mockEnregistrements.filter(
        (e) =>
          e.date_entree.startsWith(dateStr) ||
          (e.date_sortie && e.date_sortie.startsWith(dateStr))
      )
    );
  },
};
