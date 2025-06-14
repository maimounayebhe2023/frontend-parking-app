import api from "./api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Service pour les enregistrements
const enregistrementService = {
  // Ajouter un nouvel enregistrement
  ajouter: async (data) => {
    const response = await api.post("/enregistrement/ajouter", data);
    return response.data;
  },

  // Valider une sortie
  validerSortie: async (codePin) => {
    const response = await api.patch(`/enregistrement/${codePin}`);
    return response.data;
  },

  // Obtenir la liste des enregistrements
  getListe: async (params = {}) => {
    const response = await api.get("/index", { params });
    return response.data;
  },

  // Obtenir la liste des enregistrements par plage de date
  getListeByDate: async (dateDebut, dateFin) => {
    const response = await api.get("/enregistrement", {
      params: {
        date_debut: dateDebut,
        date_fin: dateFin
      }
    });
    return response.data;
  },

  // Obtenir les statistiques
  getStatistiques: async () => {
    const response = await api.get("/statistiques");
    return response.data;
  },

  // Obtenir les détails d'un enregistrement
  getDetails: async (id) => {
    const response = await api.get(`/Affiche/${id}`);
    return response.data;
  },

  // Modifier un enregistrement
  modifier: async (id, data) => {
    const response = await api.patch(`/modifier/${id}`, data);
    return response.data;
  },

  /**
   * Exporte les enregistrements au format Excel côté client
   * @param {Array} enregistrements - Liste des enregistrements à exporter
   * @returns {Promise<void>}
   */
  exportToExcel: async (enregistrements) => {
    // Préparer les données pour l'export
    const dataToExport = enregistrements.map((item) => ({
      "Code PIN": item.code_pin,
      "Plaque": item.plaque_engin,
      "Type d'engin": item.typeengin,
      "Date d'entrée": new Date(item.date_enregistrement).toLocaleString(),
      "Date de sortie": item.date_sortie ? new Date(item.date_sortie).toLocaleString() : "En stationnement",
      "Nom": item.nom_conducteur,
      "Prénom": item.prenom_conducteur,
      "Téléphone": item.tel,
      "Catégorie": item.categorie_nom,
      "Statut": item.date_sortie ? "Sorti" : "Non sorti"
    }));

    // Créer un nouveau classeur
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historique");

    // Générer le fichier Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Télécharger le fichier
    const fileName = `historique_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  },

  /**
   * Calcule la durée de stationnement
   * @param {string} dateEntree - Date d'entrée
   * @param {string} dateSortie - Date de sortie
   * @returns {string} - Durée formatée
   */
  calculateDuration: (dateEntree, dateSortie) => {
    const entree = new Date(dateEntree);
    const sortie = new Date(dateSortie);
    const duree = Math.round((sortie - entree) / (1000 * 60));
    return duree < 60
      ? `${duree} min`
      : `${Math.floor(duree / 60)}h${duree % 60}min`;
  },

  /**
   * Génère le nom du fichier d'export avec la date du jour
   * @returns {string} - Nom du fichier
   */
  generateFileName: () => {
    const date = new Date().toISOString().split("T")[0];
    return `historique_${date}.xlsx`;
  },
};

export default enregistrementService;
