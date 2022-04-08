/*--------------------------FONCTIONS DE FILTRAGE---------------------------*/
class Filtre {
    constructor(id, type, name) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.icon;
    }
    setIcon(src) {
        this.icon = src;
    }
}

var initialiserFiltres = () => {
    filtres = {
        couleur: [],
        region: [],
        commande: [],
        garde: [
            {
                id: "a-boire",
                type: "garde",
                name: "À boire",
            },
            {
                id: "a-boire-ou-a-garder",
                type: "garde",
                name: "À boire ou à garder"
            },
            {
                id: "a-garder",
                type: "garde",
                name: "À garder",
            }
        ],
        archive: [
            {
                id: "archivee",
                type: "archive",
                name: "Bouteiles archivées",
            },
        ]
    };

    filtresActifs = {
        couleur: [],
        region: [],
        commande: [],
        garde: [],
        archive: [],
    };
}

const radioElement = (id, type, name) => {
    var element = document.createElement("li");
    let html = '<label class="radio-check">'
    html += '<input type="radio" onclick=' + 'check("' + id + '","' + type + '") id="' + id + '" name="' + type + '" value="' + id + '">'
    html += '<div style="display: flex; align-items : center; margin-left: 20px"><div for="id1" class="text-radio">' + name + '</div></div> '
    html += '</label>';
    element.innerHTML = html;
    return element;
}

const filterElement = (id, type, name) => {
    var element = document.createElement("li");
    element.innerHTML = '<div class="filter-checkbox" onclick=' + 'check("' + id + '","' + type + '")><div id="' + id + '" class="checkbox"></div><div class="text-check">' + name + '</div>'
        + '</div>';
    return element;
}

const getName = (id, type) => {
    let name = "";
    if (type === "couleur") {
        filtres.couleur.map((item) => {
            if (item.id === id) {
                name = item.name;
            }
        });
    }
    if (type === "region") {
        filtres.region.map((item) => {
            if (item.id === id) {
                name = item.name;
            }
        });
    }

    if (type === "commande") {
        filtres.commande.map((item) => {
            if (item.id === id) {
                name = item.name;
            }
        });
    }

    if (type === "garde") {
        filtres.garde.map((item) => {
            if (item.id === id) {
                name = item.name;
            }
        });
    }
    if (type === "archive") {
        filtres.archive.map((item) => {
            if (item.id === id) {
                name = item.name;
            }
        });
    }
    return name;
}

const removeFilters = () => {
    var filtred;
    if (filtresActifs.couleur.length > 0) {
        filtresActifs.couleur.map(item => {
            unCheck(item.id);
        })
        filtresActifs.couleur = [];
    }
    if (filtresActifs.region.length > 0) {
        filtresActifs.region.map(item => {
            unCheck(item.id);
        })
        filtresActifs.region = [];
    }
    if (filtresActifs.commande.length > 0) {
        filtresActifs.commande.map(item => {
            unCheck(item.id);
        })
        filtresActifs.commande = [];
    }
    if (filtresActifs.garde.length > 0) {
        filtresActifs.garde.map(item => {
            unCheckRadio(item.id);
        })
        filtresActifs.garde = [];
    }
    if (filtresActifs.archive.length > 0) {
        filtresActifs.archive.map(item => {
            unCheck(item.id);
        })
        filtresActifs.archive = [];
    }
    filtrerCouleur();
    displayFilters();

}
const getCouleurs = () => {
    var ajout = "faux";
    mesvins.map(vin => {
        if (filtres.couleur.length == 0) {
            filtres.couleur.push({
                'id': vin.couleur,
                'type': 'couleur',
                'name': vin.couleur,
            });
            ajout = "vrai";
        }
        else {
            filtres.couleur.map(item => {
                if (vin.couleur === item.name) {
                    ajout = "vrai";//couleur deja presente dans la liste
                }
            })
            if (ajout === "faux") {
                filtres.couleur.push({
                    'id': vin.couleur,
                    'type': 'couleur',
                    'name': vin.couleur
                });
                ajout = "vrai";
            }
        }
        ajout = "faux";
    });
    return filtres.couleur;
}

const getCommandes = () => {
    var ajout = "faux";
    mesvins.map((vin) => {
        vin.commandes.map((commande) => {
            if (filtres.commande.length == 0) {
                filtres.commande.push({
                    'id': commande.id_order,
                    'type': 'commande',
                    'name': "Commande du " + commande.date_fr
                });
                ajout = "vrai";
            } else {
                filtres.commande.map(item => {
                    if (commande.id_order === item.id) {
                        ajout = "vrai";//commande deja presente dans la liste
                    }
                })
                if (ajout === "faux") {
                    filtres.commande.push({
                        'id': commande.id_order,
                        'type': 'commande',
                        'name': "Commande du " + commande.date_fr
                    }
                    );
                    ajout = "vrai";
                }
            }
            ajout = "faux";
        });
    });
    return filtres.commande;

}

const getLimitesPrix = () => {
    let minimum = parseFloat(mesvins[0].price);
    let maximum = parseFloat(mesvins[0].price);
    let current;
    mesvins.map((vin) => {
        current = parseFloat(vin.price);
        if (current < minimum) {
            minimum = current;
        }
        if (current > maximum) {
            maximum = current;
        }
    });
    return ([minimum, maximum]);
}
const getRegions = () => {
    var ajout = "faux";
    mesvins.map(vin => {
        if (filtres.region.length == 0) {
            filtres.region.push({
                'id': vin.region_sans_espace,
                'type': 'region',
                'name': vin.region
            });
            ajout = "vrai";
        }
        else {
            filtres.region.map(item => {
                if (vin.region === item.name) {
                    ajout = "vrai";//region deja presente dans la liste
                }
            })
            if (ajout === "faux") {
                filtres.region.push({
                    'id': vin.region_sans_espace,
                    'type': 'region',
                    'name': vin.region
                }
                );
                ajout = "vrai";
            }
        }
        ajout = "faux";
    });
    return filtres.region;
}

const getAndAddFilters = () => {

    const regionList = document.getElementById("region");
    const couleurList = document.getElementById("couleur");
    const commandeList = document.getElementById("commande");

    const region = getRegions();
    const couleur = getCouleurs();
    const commande = getCommandes();

    [prixMin, prixMax] = getLimitesPrix();
    filtrePrixActif = document.createElement('div');
    filtrePrixActif.className = "filter";
    filtrePrixActif.style.display = "none";

    let sliderOne = document.getElementById("slider-1")
    sliderOne.min = parseInt(prixMin);
    sliderOne.max = parseInt(prixMax);
    sliderOne.value = parseInt(prixMin);
    let displayValOne = document.getElementById("range1");
    displayValOne.textContent = sliderOne.value + " €";

    let sliderTwo = document.getElementById("slider-2");
    sliderTwo.min = parseInt(prixMin);
    sliderTwo.max = parseInt(prixMax) + 1;
    sliderTwo.value = parseInt(prixMax) + 1;
    let displayValTwo = document.getElementById("range2");
    displayValTwo.textContent = sliderTwo.value + " €";


    if (couleur.length != 0) {
        couleur.map((item) => {
            var element = filterElement(item.id, item.type, item.name);
            couleurList.appendChild(element);
        })
    }

    if (region.length != 0) {
        region.map((item) => {
            var element = filterElement(item.id, item.type, item.name);
            regionList.appendChild(element);
        })
    }

    if (commande.length != 0) {
        commande.map((item) => {
            var element = filterElement(item.id, item.type, item.name);
            commandeList.appendChild(element);
        })
    }
}

const showFilters = () => {
    document.getElementById('loader').style.display = "none"
    $("#modal_filtres").modal();
}

const check = (id, type) => {

    const name = getName(id, type);

    if (addNewFilter(id, type, name) == true) {
        if (type === "region" || type === "couleur" || type === "commande" || type === "archive") {
            document.getElementById(id).className = "checkbox-checked";
            document.getElementById(id).innerHTML = '<img class="checked" src="../modules/macave/views/img/check.svg"/>'
        }
    }
    else {
        removeFilter(id, type);
    }
    filtrerCouleur();
    displayFilters();
}

const unCheck = (id) => {
    document.getElementById(id).className = "checkbox";
}

const unCheckRadio = (id) => {
    document.getElementById(id).checked = false;
}

const activeFilterElement = (id, type, name) => {
    let nouveauFiltre = document.createElement('div');
    nouveauFiltre.className = "filter";
    nouveauFiltre.innerHTML = '<div style="display: flex; justify-content: flex-start; align-items:center; margin-left: 3px; white-space: nowrap"' + 'onclick=' + 'removeFilter("' + id + '","' + type + '")' + '><img style="width: 12px;height: 12px; margin-right: 5px" src="../../modules/macave/views/img/annuler-blanc.svg" /></img>' + name + '</div>';
    return nouveauFiltre;
}

const displayFilters = () => {

    document.getElementById('active-filters').innerHTML = "";

    if (filtresActifs.couleur.length == 0 && filtresActifs.region.length == 0 && filtresActifs.garde == 0 && filtresActifs.commande.length == 0 && filtresActifs.archive.length == 0) {
        document.getElementById('active-filters').style.display = "none";
    }
    else {
        document.getElementById('active-filters').style.display = "flex";
    }

    if (filtresActifs.commande.length != 0) {
        filtresActifs.commande.map((item) => {
            const element = activeFilterElement(item.id, "commande", item.name);
            document.getElementById('active-filters').appendChild(element);
        })
    }

    if (filtresActifs.couleur.length != 0) {
        filtresActifs.couleur.map((item) => {
            const element = activeFilterElement(item.id, "couleur", item.name);
            document.getElementById('active-filters').appendChild(element);
        })
    }

    if (filtresActifs.region.length != 0) {
        filtresActifs.region.map((item) => {
            const element = activeFilterElement(item.id, "region", item.name);
            document.getElementById('active-filters').appendChild(element);
        })
    }
    if (filtresActifs.archive.length != 0) {
        filtresActifs.archive.map((item) => {
            const element = activeFilterElement(item.id, "archive", item.name);
            document.getElementById('active-filters').appendChild(element);
        })
    }
    if (filtresActifs.garde.length != 0) {
        filtresActifs.garde.map((item) => {
            const element = activeFilterElement(item.id, "garde", item.name);
            document.getElementById('active-filters').appendChild(element);
        })
    }

    document.getElementById('active-filters').appendChild(filtrePrixActif);
}

const addNewFilter = (id, type, name) => {

    let present = false;

    if (type === 'couleur') {
        if (filtresActifs.couleur.length != 0) {
            filtresActifs.couleur.map((item) => {
                if (item.id === id) {
                    present = true;
                }
            });
        }
        if (present === false) {
            filtresActifs.couleur.push({
                id: id,
                type: type,
                name: name,
            });
            return true;
        }
        else {
            return false;
        }
    }

    if (type === 'region') {
        if (filtresActifs.region.length != 0) {
            filtresActifs.region.map((item) => {
                if (item.id === id) {
                    present = true;
                }
            });
        }
        if (present === false) {
            filtresActifs.region.push({
                id: id,
                type: type,
                name: name,
            });

            return true;
        }
        else {
            return false;
        }
    }

    if (type === 'commande') {
        if (filtresActifs.commande.length != 0) {
            filtresActifs.commande.map((item) => {
                if (item.id === id) {
                    present = true;
                }
            });
        }
        if (present === false) {
            filtresActifs.commande.push({
                id: id,
                type: type,
                name: name,
            });

            return true;
        }
        else {
            return false;
        }
    }

    if (type === 'archive') {
        if (filtresActifs.archive.length != 0) {
            filtresActifs.archive.map((item) => {
                if (item.id === id) {
                    present = true;
                }
            });
        }
        if (present === false) {
            filtresActifs.archive.push({
                id: id,
                type: type,
                name: name,
            });

            return true;
        }
        else {
            return false;
        }
    }

    if (type === 'garde') {

        if (filtresActifs.garde.length != 0) {
            filtresActifs.garde.map((item) => {
                if (item.id === id) {
                    present = true;
                }
            });
        }
        if (present === false) {
            filtresActifs.garde = [];
            filtresActifs.garde.push({
                id: id,
                type: type,
                name: name,
            });
            return true;
        }
        else {
            return false;
        }
    }

}

const removeFilter = (id, type) => {

    var filtred;

    if (type === "couleur") {
        unCheck(id);
        filtred = filtresActifs.couleur.filter((value, index, arr) => {
            if (value.id !== id) {
                return (value);
            };
        });
        filtresActifs.couleur = filtred;
        filtrerCouleur();
    }
    if (type === "region") {
        unCheck(id);
        filtred = filtresActifs.region.filter((value, index, arr) => {
            if (value.id !== id) {
                return (value);
            }
        });
        filtresActifs.region = filtred;
        filtrerCouleur();
    }
    if (type === "commande") {
        unCheck(id);
        filtred = filtresActifs.commande.filter((value, index, arr) => {
            if (value.id !== id) {
                return (value);
            }
        });
        filtresActifs.commande = filtred;
        filtrerCouleur();
    }

    if (type === "garde") {
        unCheckRadio(id);
        filtresActifs.garde = [];
        filtrerCouleur();
    }

    if (type === "archive") {
        unCheck(id);
        filtred = filtresActifs.archive.filter((value, index, arr) => {
            if (value.id !== id) {
                return (value);
            }
        });
        filtresActifs.archive = filtred;
        console.log(filtresActifs);
        filtrerCouleur();
    }
    displayFilters();
}

const filtrerCouleur = () => {

    let vinsFiltres = [];
    if (filtresActifs.couleur.length != 0) {
        filtresActifs.couleur.map((item) => {
            mesvins.map((vin) => {
                if (vin.couleur === item.id) {
                    vinsFiltres.push(vin);
                }
            })
        });
        filtrerRegion(vinsFiltres);
    }
    else {
        filtrerRegion(mesvins);
    }
}

const filtrerRegion = (vins) => {
    const vinsFiltres = [];
    if (filtresActifs.region.length != 0) {
        filtresActifs.region.map((item) => {
            vins.map((vin) => {
                if (vin.region_sans_espace === item.id) {
                    vinsFiltres.push(vin);
                }
            });
        });
        filtrerGarde(vinsFiltres);
    }
    else {
        filtrerGarde(vins);
    }
}

const filtrerGarde = (vins) => {
    const vinsFiltres = [];
    if (filtresActifs.garde.length != 0) {
        filtresActifs.garde.map((item) => {
            vins.map((vin) => {
                if (vinConformeGarde(item.id, vin) == true) {
                    vinsFiltres.push(vin);
                }
            });
        });
        filtrerCommande(vinsFiltres);
    }
    else {
        filtrerCommande(vins);
    }
}


const vinConformeGarde = (id, vin) => {
    var today = new Date();
    var year = today.getFullYear();
    if (id === "a-boire") {
        if ((vin.conso_1 <= year) && (vin.conso_2 <= year + 2)) {
            return true;
        }
        else {
            return false;
        }
    }
    if (id === "a-boire-ou-a-garder") {
        if ((vin.conso_1 <= year) && (vin.conso_2 > year + 2)) {
            return true;
        }
        else {
            return false;
        }
    }
    if (id === "a-garder") {
        if ((vin.conso_1 > year) && (vin.conso_2 > year + 1)) {
            return true;
        }
        else {
            return false;
        }
    }
}

const filtrerCommande = (vins) => {
    let vinsFiltres = [];
    let filtred = [];

    if (filtresActifs.commande.length != 0) {
        filtresActifs.commande.map((item) => {
            vins.map((vin) => {
                vin.commandes.map((commande) => {
                    if (commande.id_order === item.id) {
                        //un vin peut deja avoir ete ajoutte si il etait present dans une autre commande
                        filtred = vinsFiltres.filter((value, index, arr) => {
                            if (value.id !== vin.id) {
                                return (value);
                            };
                        });
                        filtred.push(vin);
                        vinsFiltres = filtred;

                    }
                });
            });
        });
        filtrerPrix(vinsFiltres)
    }
    else {
        filtrerPrix(vins);
    }
}

const filtrerPrix = (vins) => {

    let sliderOne = document.getElementById("slider-1");
    let sliderTwo = document.getElementById("slider-2");

    let vinsFiltres = [];
    let filtred = [];

    vins.map((vin) => {
        if (parseFloat(vin.price) >= parseInt(sliderOne.value) && parseFloat(vin.price) <= parseInt(sliderTwo.value)) {
            vinsFiltres.push(vin);
        }
    });

    filtrerArchive(vinsFiltres)

}

const filtrerArchive = (vins) => {
    let vinsFiltres = [];
    if (filtresActifs.archive.length > 0) {//il ya un filtre de type archivage
        filtresActifs.archive.map((archive) => {
            if (archivee.id === "archivee") {
                vins.map(vin => {
                    if (stocks.length > 0) {
                        let trouveEtArchivee = false;
                        stocks.map(item => {
                            if (parseInt(item.id_product) == parseInt(vin.id)) {
                                if (parseInt(item.archived) == 1) {
                                    trouveEtArchivee = true;
                                }
                            }
                        });
                        if (trouveEtArchivee == true) {
                            vinsFiltres.push(vin);
                        }
                    }
                });
                afficherVins(vinsFiltres);
            }
        });
    }
    else {//on affiche seulement les bouteilles non archivees par defaut
        let vinsFiltres = [];
        if (vins.length > 0) {
            vins.map(vin => {
                if (stocks.length > 0) {
                    let trouveEtArchivee = false;
                    stocks.map(item => {
                        if (parseInt(item.id_product) == parseInt(vin.id)) {
                            if (parseInt(item.archived) == 1) {
                                trouveEtArchivee = true;
                            }
                        }
                    });
                    if (trouveEtArchivee == false) {
                        vinsFiltres.push(vin);
                    }
                }
                else {
                    vinsFiltres.push(vin);
                }
            });
            afficherVins(vinsFiltres);
        }
    }
}


let minGap = 1;
const fillColor = () => {
    percent1 = (sliderOne.value / sliderMaxValue) * 100;
    percent2 = (sliderTwo.value / sliderMaxValue) * 100;

}

const activeFilterPrice = (textPrix1, textPrix2) => {
    filtrePrixActif.innerHTML = '<div style="display: flex; justify-content: flex-start; align-items:center; margin-left: 3px; white-space: nowrap"' + 'onclick=' + 'removeFilterPrice("filter-price")' + '><img style="width: 12px;height: 12px; margin-right: 5px" src="../../modules/macave/views/img/annuler-blanc.svg" />' + textPrix1 + ' - ' + textPrix2 + '</img></div > ';
    filtrePrixActif.style.display = "flex";
    displayFilters();
    document.getElementById('active-filters').style.display = "flex";
}

const removeFilterPrice = () => {
    filtrePrixActif.innerHTML = "";
    filtrePrixActif.style.display = "none";
    reinitialiserSliders();
    displayFilters();
    filtrerCouleur();
}

const reinitialiserSliders = () => {

    let sliderOne = document.getElementById("slider-1")
    sliderOne.value = parseInt(prixMin);
    let displayValOne = document.getElementById("range1");
    displayValOne.textContent = sliderOne.value + " €";

    let sliderTwo = document.getElementById("slider-2");
    sliderTwo.value = parseInt(prixMax) + 1;
    let displayValTwo = document.getElementById("range2");
    displayValTwo.textContent = sliderTwo.value + " €";

};

const slideOne = () => {
    let sliderOne = document.getElementById("slider-1");
    let sliderTwo = document.getElementById("slider-2");
    let displayValOne = document.getElementById("range1");
    let displayValTwo = document.getElementById("range2");
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value + " €";
    activeFilterPrice(displayValOne.textContent, displayValTwo.textContent);
}

const slideTwo = () => {
    let sliderOne = document.getElementById("slider-1");
    let sliderTwo = document.getElementById("slider-2");
    let displayValOne = document.getElementById("range1");
    let displayValTwo = document.getElementById("range2");

    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value + " €";
    activeFilterPrice(displayValOne.textContent, displayValTwo.textContent);
}
