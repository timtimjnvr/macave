//variables globales du module ma cave
var mesvins;
var idClient;
var mesNotes;
var stocks;
var nom;
var verticalPixelPageSize;

//variables relatives aux filtres
var filtres;
var filtresActifs;
var bouteillesArchives;
var prixMin;
var prixMax;
var filtrePrixActif;

//variables relatives aux tris
var typeTri;
var sensTri; //"croissant" ou "decroissant"

//variables globales relatives a l export pdf
var selectedProducts;

//variables relatives aux notes
var idProduitCommente;
var nombreEtoiles;
var commentaire;

//variables relatives aux achats
var idProduitAcheter;
var nombreBouteilles;

//variables relatives aux stock
var stock;
var idStockProduit;
var action;
var archivedStatus;

//variables relatives au display
var scroll;
var select;
var longpress = 300;

var trouverVinDansCave = (id) => {
    var bouteille;
    mesvins.map((vin) => {
        if (vin.id == id) {
            bouteille = vin;
        }
    })
    return bouteille;
}




