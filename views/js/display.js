const ecouterRecherche = () => {
    document.getElementById('search').addEventListener("input", (e) => {
        const input = document.getElementById('search').value;
        const liste = document.getElementById("search-propositions");
        liste.innerHTML = "";
        liste.style.display = "flex";
        if (input.length > 0) {
            const vinsFiltres = [];
            ajout = "faux";
            mesvins.map(vin => {
                const res = slugify(vin.nom.toLowerCase()).includes(slugify(input.toLowerCase()));
                if (res == true) {
                    vinsFiltres.push(vin);
                    const id = vin.id;
                    const nom = document.createElement("li");
                    nom.className = "proposition";
                    nom.innerHTML = vin.nom;
                    nom.addEventListener("click", (e) => scrollVin(id));
                    liste.appendChild(nom);
                }
            })
            liste.style.display = "flex";
        }
    });
}

/*------------------AFFICHAGE DES VINS -------------------*/

//classe Note -> Notation d'un produit du client
class Note {
    constructor(rating, commentaire, idVin) {
        this.plus = false;//true si il y a plus de notes a afficher ensuite
        this.idVin = idVin;
        this.rating = rating;
        this.commentaire = commentaire;
    }

    setPlus(boolean) {
        this.plus = boolean;
    }

    displayNote() {
        let html = '<div class="note">'
        html += '<div class="rating">'
        //Etoiles jaunes
        for (let i = 1; i <= this.rating; i++) {
            html += '<img style="width: 15px; display: flex" src="../../modules/macave/views/img/etoile_jaune.svg"/>';
        }
        //etoiles blanches
        if (this.rating != 5) {
            for (let j = this.rating; j <= 4; j++) {
                html += '<img style="width: 15px; display: flex" src="../../modules/macave/views/img/etoile.svg"/>';
            }
        }
        html += '</div>'
        html += '<div class="text"><div class="inside-text">' + this.commentaire
            + '</div>';
        if (this.plus == true) {
            html += '<div id="' + this.idVin + '-plus" style="font-size: 2rem; line-height: 1rem; color:#cc2669; display: flex; justify-content: center; align-items: start; vertical-align: top;" onclick="tousMesAvis(' + this.idVin + ')">+</div>';
        }
        html += '</div></div>';
        return (html);
    }
}

//classe ListeNotes -> Liste des notes mises par le client sur un produit
class ListeNotes {
    constructor(notes) {
        this.notes = [];
    }

    //ajoutte les notes correspondantes a la liste et ajoutte le plus si il y a plus d une note a afficher
    initListe(idVin, notes) {
        let compteur = 0;
        if (notes.length > 0) {
            notes.map(item => {
                if (item.id_product === idVin) {
                    let note = new Note(item.rating, item.text_review, idVin);
                    this.notes.push(note);
                    compteur += 1;
                }
            });
        }
        if (compteur >= 2) {
            this.notes[0].setPlus(true);
        }
    }

    displayNotes(idVin) {
        let compteur = 0;
        let html = '';
        if (this.notes.length > 0) {
            this.notes.map((item) => {
                compteur += 1;
                //1ere note : (on rajoutte le plus pour afficher toutes les notes)
                if (compteur == 1) {
                    html += item.displayNote()
                } else {
                    if (compteur == 2) {
                        html += '<div id="' + idVin + '-hiden-notes" class="hiden-notes" onclick="unSeulAvis(' + idVin + ')">'
                    }
                    if (compteur == this.notes.length) {
                        if (this.compteur == 2) {
                            html += '</div>';
                        }
                        else {
                            html += item.displayNote();
                            html += '</div>';
                        }
                    }
                    else {
                        html += item.displayNote();
                    }
                }
            });
            return (html);
        }
        else {
            return ("")
        }
    }
}

class Vin {
    constructor(vin) {
        this.vin = vin;//the full wine structure with all infos
    }

    //on ne peut partager que des vins actifs
    activityShare() {
        return ('<div onclick="shareLink(' + this.vin.id + ')" class="left-button"><div class="left-button-inside">Partager</div><img class="filters-button" src="../../modules/macave/views/img/share.svg" /></div>');

    }

    //on ne peut acheter que des vins actifs
    activityAcheter() {
        if (this.vin.activity == 1) {
            return (
                '<div onclick="combienDeBouteilles(' + this.vin.id + ')" class="left-button"><div class="left-button-inside">Acheter</div><img class="filters-button" src="../../modules/macave/views/img/panier.svg" /></div>'
            );
        }
        else {
            return (
                '<div onclick="combienDeBouteilles(' + this.vin.id + ')" class="left-button gray"><div class="left-button-inside">Acheter</div><img class="filters-button" src="../../modules/macave/views/img/panier-gray.svg" /></div>'
            );
        }
    }

    datesConso() {
        if ((this.vin.conso_1 != 0) && (this.vin.conso_2 != 0)) {
            return (
                '<div class="dates-conso">'
                + '<div style="width: 40px; display: flex;justify-content: center"><img class="wine-glass" src="../../modules/macave/views/img/verre-a-vin.svg"/></div>'
                + '<div class="gray-text">' + this.vin.conso_1 + '-' + this.vin.conso_2 + '</div>'
                + '</div>'
            );
        }
        if ((this.vin.conso_1 == 0) && (this.vin.conso_2 != 0)) {
            return (
                '<div class="dates-conso">'
                + '<div style="width: 40px; display: flex;justify-content: center"><img class="wine-glass" src="../../modules/macave/views/img/verre-a-vin.svg"/></div>'
                + '<div class="gray-text"> jusqu\'à ' + this.vin.conso_2 + '</div > '
                + '</div>'
            );
        }
        if ((this.vin.conso_1 != 0) && (this.vin.conso_2 == 0)) {
            return (
                '<div class="dates-conso">'
                + '<div style="width: 40px; display: flex;justify-content: center"><img class="wine-glass" src="../../modules/macave/views/img/verre-a-vin.svg"/></div>'
                + '<div class="gray-text"> dès ' + this.vin.conso_1 + '</div>'
                + '</div>'
            );
        }
        else {
            return (
                '<div class="dates-conso">'
                + '<div style="width: 40px; display: flex;justify-content: center"><img class="wine-glass" src="../../modules/macave/views/img/verre-a-vin.svg"/></div>'
                + '<div class="gray-text">libre</div>'
                + '</div>')
        }
    }
    //prix d achat
    acheterA() {
        if (this.vin.unit_price_paid === '0.00') {
            return ('<div class="gray-text bold">' + this.vin.price + '€ TTC</div>');
        }
        else {
            return ('<div class="gray-text bold">' + this.vin.unit_price_paid + '€ TTC</div>')
        }
    }

    gridCaract() {
        return (
            '<div class="grid">'
            + '<div class="column-grid">'
            + '<div class="line1-grid">Gamme</div>' + '<div>' + this.vin.gamme + '</div>'
            + '</div>'
            + '<div class="column-grid">'
            + '<div class="line1-grid">Concentration</div>' + '<div>' + this.vin.concentration + '</div>'
            + '</div>'
            + '<div class="column-grid">'
            + '<div class="line1-grid">Jury Pro</div>' + '<div>' + this.vin.jury_pro + '</div>'
            + '</div>'
            + '<div class="column-grid">'
            + '<div class="line1-grid">Jury Amateur</div>' + '<div>' + this.vin.jury_amateur + '</div>'
            + '</div>'
            + '</div>')
    }
    pastille() {
        let html = '';
        if (this.vin.couleur === "Rouge") {
            html = '<div style="background-color: var(--rouge);" id="' + this.vin.id + '-pastille" class="pastille"></div>'
        }
        if (this.vin.couleur === "Blanc") {
            html = '<div style="background-color: var(--blanc);" id="' + this.vin.id + '-pastille" class="pastille"></div>'
        }
        if (this.vin.couleur === "Rosé") {
            html = '<div style="background-color: var(--rose);" id="' + this.vin.id + '-pastille" class="pastille"></div>'
        }
        if (this.vin.couleur === "Bulles") {
            html = '<div style="background-color: white; border: 1px solid var(--bulles)" id="' + this.vin.id + '-pastille" class="pastille"></div>'
        }
        return html;
    }

    caracteristics() {
        let html = '';

        html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Commandé</div>' + '<div>' + this.vin.quantite_totale + ' fois</div></div>'


        if (this.vin.jury_pro !== "nr") {
            html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Jury pro</div>' + '<div>' + this.vin.jury_pro + '</div></div>'
        }

        if (this.vin.jury_amateur !== "nr") {
            html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Jury amateur</div>' + '<div>' + this.vin.jury_amateur + '</div></div>'
        }
        if (this.vin.gamme !== "nr") {
            html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Gamme</div>' + '<div>' + this.vin.gamme + '</div></div>'
        }

        /*if (this.vin.concentration !== "nr") {
            html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Concentration</div>' + '<div>' + this.vin.concentration + '</div></div>'
        }

        if (this.vin.fraicheur !== "nr") {
            html += '<div style="margin: 5px" class="column-center gray-text"><div style="text-decoration: underline">Fraicheur</div>' + '<div>' + this.vin.fraicheur + '</div></div>'
        }*/
        return html;

    }

    stockOf() {
        let trouve = false;
        let result;
        if (stocks.length > 0) {
            stocks.map((item) => {
                if (parseInt(item.id_product) == parseInt(this.vin.id)) {
                    trouve = true;
                    result = [parseInt(item.stock), parseInt(item.archived)];
                }
            });
            if (trouve == true) {
                return (result);
            }
            else {
                return ([parseInt(this.vin.quantite_totale), 0]);
            }
        } else {
            return ([parseInt(this.vin.quantite_totale), 0]);
        }
    }

    afficherVin() {
        let html = '';
        const nouveauVin = document.createElement("div");
        nouveauVin.setAttribute("id", this.vin.id);
        nouveauVin.className = "wine";

        let listeNote = new ListeNotes();
        listeNote.initListe(this.vin.id, mesNotes);
        let htmlNote = listeNote.displayNotes(this.vin.id);

        //la case à cocher pour l'export pdf
        html += '<div id="' + this.vin.id + '-select-case" class="select"></div>'
        html += htmlNote;
        html += '<div class="photo-infos">' + '<div class="wine-icon-container">' + this.pastille() + '<div onclick="showPopUpPhoto(' + this.vin.id + ')" class="wine-icon" style="background-image: url(' + this.vin.image_url + ')"></div><img class="loupe" src="../../modules/macave/views/img/loupe.svg"/></div>'
            + '<div class="second-column">'

        html += '<div class="nom">' + this.vin.nom

        if (this.vin.bio === "oui") {
            html += ' <img  class="bio" src="' + prestashop.urls.base_url + '/themes/classic/assets/images/logo_bio.jpg">'
        }

        html += '</div>'
            + '<div class="container-infos-actions">'
            + '<div class="line-caract">'
            + '<div class="name-caract gray-text">AOC:</div>'
            + '<div class="text-caract gray-text">' + this.vin.aoc + '</div>'
            + '</div>'
            + '<div class="line-caract">'
            + '<div class="logo-caract-container">'
            + '<img class="logo-caract" src="../../modules/macave/views/img/grappe.svg">'
            + '</div>'
            + '<div class="text-caract gray-text">' + this.vin.cepages_principaux + '</div>'
            + '</div>'
            + '<div class="line-2-caract">'
            + this.datesConso()
            + this.acheterA()
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="punchline-container">'
            + '<div class="punchline"> ' + this.vin.punchline + '</div>'
            + '<div id="' + this.vin.id + '-down" style="display: flex; justify-content: center;align-items: center; text-align: center" onclick="showDescription(' + this.vin.id + ')">'
            + '<p style="height: 1rem; margin-right: .5rem; vertical-align: middle; color: var( --lbv-color); font-weight: bold">en savoir plus </p>'
            + '<img style="width: 15px; height: 15px" src="../../modules/macave/views/img/fleche-vers-le-bas-red.svg"/>'
            + '</div>'
            + '</div>'

            + '<div class="stock-container">'
            + '<div class="stock">En stock dans ma cave : <div class="stock-number" id="' + this.vin.id + '-stock" onclick="popUpStock(' + this.vin.id + ')">'
            + this.stockOf()[0]
            + ' bouteilles</div></div>'
            + '<div class="edit-stock-button" onclick="popUpStock(' + this.vin.id + ')""><img style="width: 25px" src="../../modules/macave/views/img/crayon-de-couleur.svg"</div>'
            + '</div>'
            + '</div>'

            + '<div id="' + this.vin.id + '-description" onclick="hideDescription(' + this.vin.id + ')" class="description">'
            + '<div style="width:100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-around">'
            + this.caracteristics()
            + '</div>'
            + '<div class="commentaire">'
            + '<p style="text-align: justify">' + this.vin.description + '</p>'
            + '</div>'

            + '<div id="' + this.vin.id + '-up" style="display: none; justify-content: center;align-items: center; text-align: center; margin-bottom: 20px" onclick="hideDescription(' + this.vin.id + ')">'
            + '<p style="height: 1rem; margin-right: .5rem; vertical-align: middle; color: var( --lbv-color); font-weight: bold">fermer </p>'
            + '<img style="width: 15px; height: 15px" src="../../modules/macave/views/img/fleche-vers-le-haut-red.svg"/>'
            + '</div>'


            + '</div>'
            + '<div class="container-actions">'
            + '<div onclick="showPopUpCom(' + this.vin.id + ')" class="left-button"><div class="left-button-inside">Noter</div><img class="filters-button" src="../../modules/macave/views/img/etoile-rouge.svg" /></div>'
            + this.activityShare()
            + this.activityAcheter()
            + '</div>'

            + '</div>';
        nouveauVin.innerHTML = html;
        //ecoute selection pour des fiches pdf
        nouveauVin.addEventListener('click', (e) => {
            if (select == true) {
                checkAndAddToSelectedProducts(this.vin.id);
            }
        });

        return nouveauVin;
    }

}

//Pas encore utilise
class Vins {
    constructor() {
        this.liste = [];
    }

    initListe(vins) {
        let vin;
        if (vins.length > 0) {
            vins.map((vin) => {
                nouveauVin = new Vin(vin);
                this.liste.push(nouveauVin);
            });
        }
    }

}
//affichee si il n y a pas de bouteille dans la cave
const commanderViteDuVin = () => {
    const mesvinsList = document.getElementById('my-wines');
    const pasDeVin = '<div style="width:100vw; height: 80vh; display: flex; flex-direction: column; justify-content: start; align-items: center; text-align: center;">'
        + '<div style="width:90vw; margin-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center">'
        + '<p>Vous n\'avez pas encore commandé de vin chez LBV Sélection.</p>'
        + '<p style="margin-top : 20px">Faites un tour sur notre Sélection ou laisser vous guider par notre guide intéractif !</p>'
        + '<div style="display: flex; justify-content: center; align-items: center; margin-top: 30px">'
        + '<a class="btn btn-primary" href="/31-la-selection">La sélection</a>'
        + '<a style="margin-left: 30px" class="btn btn-primary" href="/trouver-le-bon-vin">Le guide</a>'
        + '</div>'
        + '</div>'
        + '</div>';
    mesvinsList.innerHTML = pasDeVin;
}

//affichee si la recherche/filtre n a rien donne
const pasDeVin = () => {
    return ('<div style="width:100vw; height: 80vh; display: flex; flex-direction: column; justify-content: start; align-items: center; text-align: center;">'
        + '<div style="width:90vw; margin-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center">'
        + '<p>Il n\'y a pas de bouteilles qui correspondent à votre recherche.</p>'
        + '<p style="margin-top : 20px">Faites un tour sur notre Sélection ou laisser vous guider par notre guide intéractif !</p>'
        + '<div style="display: flex; justify-content: center; align-items: center; margin-top: 30px">'
        + '<a class="btn btn-primary" href="/31-la-selection">La sélection</a>'
        + '<a style="margin-left: 30px" class="btn btn-primary" href="/trouver-le-bon-vin">Le guide</a>'
        + '</div>'
        + '</div>'
        + '</div>');
}

const scrollVin = (id) => {
    document.getElementById('search').value = "";
    setTimeout(() => {
        let trouve = false;
        if (vinsAffiches.length > 0) {
            vinsAffiches.map(vinAffiche => {
                if (id === vinAffiche.id) {
                    trouve = true;
                    document.getElementById("search-propositions").style.display = "none";
                }
            });
        } if (trouve == false) {
            document.getElementById("search-propositions").style.display = "none";
            removeFilters();
        }
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
}



const afficherVins = (vins) => {
    vinsAffiches = vins;
    //reinitialisation de la selection
    selectedProducts = [];
    //on reinitialise la liste
    const mesvinsList = document.getElementById('my-wines');
    mesvinsList.innerHTML = '';

    //pas de vins correspondant a la recherche
    //ne s affiche que si l utilisateur filtre des vins mais que le filtre ne correspond a aucuns vins
    if (vins.length == 0) {
        mesvinsList.innerHTML = pasDeVin();

    }
    else {
        //tri des vins
        const vinsTries = sort(vins);

        //affichage
        vinsTries.map(vin => {

            nouveauVin = new Vin(vin);
            domElement = nouveauVin.afficherVin();
            mesvinsList.append(domElement);
        });
    }
    document.getElementById('loader').style.display = "none";

    //setTimeout(hideLoad(), 100);
}

const showDescription = (id) => {
    //si on ne selectionne pas des vins pour les exporter
    if (select == false) {
        document.getElementById(id + "-up").style.display = "flex";
        document.getElementById(id + "-down").style.display = "none";
        document.getElementById(id + "-description").style.display = "flex";
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "center" });
        /*document.getElementById(id + "-description").scrollTo({
            top: 100,
            left: 100,
            behavior: 'smooth'
        }
        )*/

    }
}

const hideDescription = (id) => {
    document.getElementById(id + "-up").style.display = "none";
    document.getElementById(id + "-down").style.display = "flex";
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById(id + "-description").style.display = "none";

}

//par default on affiche que la premiere note
const tousMesAvis = (id) => {
    document.getElementById(id + "-hiden-notes").style.display = "flex";
    document.getElementById(id + "-plus").style.display = "none";
}

const unSeulAvis = (id) => {
    document.getElementById(id + "-plus").style.display = "flex";
    document.getElementById(id + "-hiden-notes").style.display = "none";
}

/*----------------------------EXPORT PDF---------------------- */
const cancelSelection = () => {
    if (selectedProducts.length != 0) {
        selectedProducts.map((idSelected) => {
            document.getElementById(idSelected).className = "wine";
            document.getElementById(idSelected + "-select-case").innerHTML = "";
        });
    }
}

const checkAndAddToSelectedProducts = (id) => {
    let trouve = "non";
    if (selectedProducts.length != 0) {
        selectedProducts.map((idSelected) => {
            if (idSelected == id) {
                trouve = "oui";
            }
        });
        if (trouve === "non") {
            selectedProducts.push(id);
            document.getElementById(id).className = "wine selected";
            document.getElementById(id + "-select-case").innerHTML = '<img class="tick-icon" src="' + '../../modules/macave/views/img/tick.svg' + '"/>';
            document.getElementById("nombre-vins").innerHTML = selectedProducts.length;

            if (selectedProducts.length == 1) {
                document.getElementById("export").innerHTML = "Exporter la fiche au format PDF";
                document.getElementById("export").className = "btn btn-tim";
                document.getElementById("export").innerHTML = "Exporter au format PDF";

                document.getElementById("nombre-vins").style.display = "flex";
                document.getElementById("nombre-vins").innerHTML = selectedProducts.length;
            }
            else {
                document.getElementById("nombre-vins").innerHTML = selectedProducts.length;
            }

        }
        else {
            selectedProducts = selectedProducts.filter(ids => ids !== id)
            document.getElementById(id).className = "wine";
            document.getElementById(id + "-select-case").innerHTML = "";
            document.getElementById("nombre-vins").innerHTML = selectedProducts.length;
            if (selectedProducts.length == 0) {
                document.getElementById("export").classList = "";
                document.getElementById("nombre-vins").style.display = "none";
                document.getElementById("export").className = "export";
                document.getElementById("export").innerHTML = "Sélectionnez des bouteilles";
            }
        }
    } else {
        selectedProducts.push(id);
        document.getElementById(id).className = "wine selected";
        document.getElementById(id + "-select-case").innerHTML = '<img style="width:15px" src="' + '../../modules/macave/views/img/tick.svg' + '"/>';
        document.getElementById("nombre-vins").innerHTML = selectedProducts.length;
        document.getElementById("nombre-vins").style.display = "flex";

        document.getElementById("export").classList = "btn btn-tim";
        document.getElementById("export").innerHTML = "Exporter au format PDF";


    }
}

const exporterEtReinitialiserAffichage = () => {
    selectedProducts.map(id => {
        document.getElementById(id).className = "wine";
    });
    vinsAffiches.map(vin => {
        document.getElementById(vin.id + "-select-case").innerHTML = "";
        document.getElementById(vin.id + "-select-case").style.display = "none";
    });
    if (selectedProducts.length >= 1) {
        exportPdf();
        document.getElementById("export").innerHTML = "Créer une fiche de dégustation"
    }
    document.getElementById("nombre-vins").innerHTML = "0";
}

const selectWines = () => {
    if (select == true) {
        exporterEtReinitialiserAffichage();
        document.getElementById("export").className = "export";
        document.getElementById("nombre-vins").style.display = "none";
        document.getElementById("cancel-export").style.display = "none";
        select = false;
    }
    else {
        document.getElementById("cancel-export").style.display = "flex";
        select = true;
        vinsAffiches.map(vin => {
            document.getElementById(vin.id + "-select-case").style.display = "flex";
        });

        if (selectedProducts.length == 0) {
            document.getElementById("export").innerHTML = "Sélectionnez des bouteilles";
        }
    }
}

const annulerExport = () => {
    selectedProducts.map(id => {
        document.getElementById(id).className = "wine";
    });
    vinsAffiches.map(vin => {
        document.getElementById(vin.id + "-select-case").innerHTML = "";
        document.getElementById(vin.id + "-select-case").style.display = "none";
    });
    document.getElementById("nombre-vins").innerHTML = "0";
    document.getElementById("export").className = "export";
    document.getElementById("export").innerHTML = "Créer une fiche de dégustation"
    document.getElementById("nombre-vins").style.display = "none";
    document.getElementById("cancel-export").style.display = "none";
    select = false;
    selectedProducts = [];
}

const slugify = str => {
    const map = {
        '-': ' ',
        '-': '_',
        'a': 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
        'e': 'é|è|ê|ë|É|È|Ê|Ë',
        'i': 'í|ì|î|ï|Í|Ì|Î|Ï',
        'o': 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
        'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c': 'ç|Ç',
        'n': 'ñ|Ñ'
    };
    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }
    return str;
}


const search = () => {
    const input = document.getElementById('search').value;
    if (input.length > 0) {
        const vinsFiltres = [];
        ajout = "faux";
        mesvins.map(vin => {
            const res = slugify(vin.nom.toLowerCase()).includes(slugify(input.toLowerCase()))
            if (res == true) {
                vinsFiltres.push(vin)
            }
        })
        afficherVins(vinsFiltres);
    }
}

const rate = (number) => {
    //reinitialize
    if (number == 0) {
        for (let pas = 1; pas <= 5; pas++) {
            document.getElementById("etoile-" + pas).src = "../../modules/macave/views/img/etoile.svg";
        }
    }
    else {
        for (let pas = 1; pas <= number; pas++) {
            document.getElementById("etoile-" + pas).src = "../../modules/macave/views/img/etoile_jaune.svg";
        }
        if (number < 5) {
            for (let pas = number + 1; pas <= 5; pas++) {
                document.getElementById("etoile-" + pas).src = "../../modules/macave/views/img/etoile.svg";
            }
        }
        nombreEtoiles = number;
    }
}

const cancel = () => {
    cancelSelection();
}

const hidePopUps = () => {
    document.getElementById('loader').style.display = "none";
    /*document.getElementById("pop-up-loader").style.display = "none";
    document.getElementById("pop-up-background").style.display = "none";
    document.getElementById("bottle-body").className = "bottle-body";*/

    document.getElementById("search-propositions").display = "none";
    document.getElementById("pop-up-com").style.display = "none";
    document.getElementById("pop-up-combien-bouteilles").style.display = "none";
    document.getElementById("pop-up-edit-stock").style.display = "none";
    document.getElementById("pop-up-background").style.display = "none";
    document.getElementById("pop-up-photo").style.display = "none";
}

const combienDeBouteilles = (id) => {
    const vin = trouverVinDansCave(id);
    if (select == false) {
        if (vin.activity == 1) {
            idProduitAcheter = id;
            const vin = trouverVinDansCave(idProduitAcheter);
            nombreBouteilles = 1;
            document.getElementById("nombre").innerHTML = nombreBouteilles;
            document.getElementById("prix").innerHTML = 'Prix : ' + vin.price + '€';
            document.getElementById("pop-up-combien-bouteilles").style.display = "flex";
            document.getElementById("pop-up-background").style.display = "flex";
        }
        else {
            const text_modal_erreur = document.getElementById('text_erreur_modal');
            text_modal_erreur.innerHTML = 'Cette bouteille n\'est plus disponible';
            $("#modal-erreur").modal()
        }
    }
}

const showPopUpCom = (id) => {
    if (select == false) {
        idProduitCommente = id;
        nombreEtoiles = 0;
        rate(0);

        //reinitialize stars and comment
        document.getElementById('commentaire-client').value = '';
        document.getElementById("pop-up-com").style.display = "flex";
        document.getElementById("pop-up-background").style.display = "flex";
    }
}

const showPopUpPhoto = (id) => {
    const vin = trouverVinDansCave(id);
    if (select == false) {
        document.getElementById('pop-up-photo-inner').innerHTML = '<div style="background-image: url(' + vin.image_url + ');height: 80%; width: 80%;background-size: 100%; background-repeat: no-repeat"></div>'
        document.getElementById("pop-up-photo").style.display = "flex";
        document.getElementById("pop-up-background").style.display = "flex";
    }
}

const soumettreNote = async () => {
    commentaire = document.getElementById('commentaire-client').value;
    hidePopUps();
    envoyerCommentaire();
}

const plusUneBouteille = () => {
    nombreBouteilles = Math.trunc(nombreBouteilles) + 1;
    document.getElementById("nombre").innerHTML = nombreBouteilles;
    const vin = trouverVinDansCave(idProduitAcheter);
    let res = (vin.price * nombreBouteilles);
    res = res.toFixed(2);
    document.getElementById("prix").innerHTML = 'Prix : ' + res + '€';
}

const moinsUneBouteille = () => {
    if (nombreBouteilles > 1) {
        nombreBouteilles = Math.trunc(nombreBouteilles) - 1;
    }
    const vin = trouverVinDansCave(idProduitAcheter);
    let res = (vin.price * nombreBouteilles);
    res = res.toFixed(2);
    document.getElementById("prix").innerHTML = 'Prix : ' + res + '€';
    document.getElementById("nombre").innerHTML = nombreBouteilles;

}

const actualiserNombreBouteilles = () => {
    const vin = trouverVinDansCave(idProduitAcheter);
    const input = document.getElementById("nombre").innerHTML;
    if (Number.isInteger(Math.trunc(input)) && Math.trunc(input) > 0) {
        nombreBouteilles = Math.trunc(input);
    }
    else {
        if (Math.trunc(input) == 0) {
            document.getElementById("nombre").innerHTML = 1;
            let res = (vin.price * nombreBouteilles);
            res = res.toFixed(2);
            document.getElementById("prix").innerHTML = 'Prix : ' + res + '€';

        }
        else {
            document.getElementById("nombre").innerHTML = nombreBouteilles;
            let res = (vin.price * nombreBouteilles);
            res = res.toFixed(2);
            document.getElementById("prix").innerHTML = 'Prix : ' + res + '€';
        }
    }
}

const acheter = () => {
    nombreBouteilles = document.getElementById("nombre").innerHTML;
    hidePopUps();
    ajoutterAuPannier();
}
