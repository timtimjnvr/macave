//dialogue avec l api accessible à l url "https://domain/module/macave/api"
//domain -> localhost || dev.lbvselection.com || www.lbvselection.com
//recupere les variables importantes aupres du serveur

class Requete {
    constructor(url) {
        this.req = new XMLHttpRequest()
        this.url = url;
        this.formData;
        this.callBack;
    }

    setData(formData) {
        this.formData = formData;
    }

    setCallBack(funct) {
        this.callBack = function () {
            funct();
        }
    }

    get() {
        this.req.open("GET", this.url, false);
        this.req.setRequestHeader('Accept', 'application/json; charset=utf-8')
        this.req.send(this.formData);
        return JSON.parse(this.req.responseText);
    }

    post() {
        document.getElementById('loader').style.display = "block";
        this.req.open("POST", this.url, true);
        this.req.onload = () => {//requete traitee
            this.callBack();
        }
        this.req.send(this.formData);
    }
}

var initialiserLesVariables = async () => {
    //get du controller
    let time = new Date();
    let t0 = time.getSeconds();
    let ms0 = time.getMilliseconds();

    const url = prestashop.urls.base_url + "module/macave/api?couleur=&id=&nameString=&notes=&stock=&time=";
    var req = new Requete(url)
    const result = await req.get();
    console.log(result)
    time = new Date();
    let t3 = time.getSeconds();
    let ms3 = time.getMilliseconds()

    //enregistrement
    mesvins = result.mesvins;
    idClient = result.id;
    mesNotes = result.mesnotes;
    nom = result.nameString;
    stocks = result.stocks;
    let t1 = result.t1;
    let t2 = result.t2;


    t0 = parseFloat(t0 + '.' + ms0).toFixed(3);
    t1 = parseFloat(t1).toFixed(3);
    t2 = parseFloat(t2).toFixed(3);
    t3 = parseFloat(t3 + '.' + ms3).toFixed(3);
    let T = [t0, t1, t2, t3];

    const ecartArray = (T) => {
        const ecart = (t, t0) => {
            if (t < t0) {
                return (parseFloat(60 - t + t0).toFixed(3));
            }
            else {
                return (parseFloat(t - t0).toFixed(3));
            }
        }
        let init = T[0];
        T.forEach((element, index, T) => {
            T[index] = ecart(element, init);
        });
        return (T);
    }

    let Tab = ecartArray(T, t0);

    let tinit = t0 - t0;
    /*console.log('Envoi de la requête par le navigateur');
    console.log('-> t0 : ' + Tab[0] + ' s');
    console.log('Reception de la requete par l\'api')
    console.log('-> t1 : ' + Tab[1] + ' s');
    console.log('Renvoi du resultat de la requete au navigateur')
    console.log('-> t2 : ' + Tab[2] + ' s');
    console.log('Reception du resultat par le navigateur')
    console.log('-> t3 : ' + Tab[3] + ' s');*/





    //initialisation
    nombreBouteilles = 1;
    typeTri = "commandes";
    sensTri = "décroissant";
    bouteillesArchives = false;

    initialiserFiltres();
    verticalPixelPageSize = $(window).height() - $(document.getElementById("header")).height() - $(document.getElementById("export-container")).height();
    select = false;

    //display
    if (mesvins.length == 0) {
        commanderViteDuVin();
    }
    else {
        getAndAddFilters();
        filtrerCouleur();
    }

    //variables non essentielles a l affichage
}

var getMesNotes = async () => {
    const url = prestashop.urls.base_url + "module/macave/api?notes=";
    var req = new Requete(url)
    const result = await req.get();
    mesNotes = result.mesnotes;

    //display
    filtrerCouleur();
}

var envoyerCommentaire = () => {
    if (nombreEtoiles == 0) {
        //le navigateur n est pas compatible
        const titre_erreur_modal = document.getElementById('titre_erreur_modal');
        const text_modal_erreur = document.getElementById('text_erreur_modal');
        titre_erreur_modal.innerHTML = "Et combien d'étoiles ?"
        text_modal_erreur.innerHTML = 'Merci de sélectionner le nombre d\'etoiles';
        $("#modal-erreur").modal()
    }
    else {
        const vin = trouverVinDansCave(idProduitCommente);
        var formData = new FormData();
        formData.append("action", "addreview");
        formData.append("rating", nombreEtoiles);
        formData.append("text_review", commentaire);
        formData.append("id_product", idProduitCommente);
        formData.append("id_customer", idClient);
        formData.append("link", vin.url)
        formData.append("recommended_product", "0");
        var req = new Requete(prestashop.urls.base_url + "module/blockreviews/ajax");
        req.setData(formData);

        //recuperer les notes et actualiser l affichage
        req.setCallBack(getMesNotes);
        req.post();
    }
}

var shareLink = (id) => {

    const vin = trouverVinDansCave(id);
    let emoji;

    if (vin.couleur === "Bulles") {
        emoji = "🥂";
    }
    else {
        emoji = "🍷";
    }

    if (select == false) {
        if (vin.activity == 1) {
            const data = {
                title: vin.nom,
                text: " Ma recommendation du jour : " + vin.nom + ". J'ai trouvé cette bouteille " + emoji + " sur le site LBV Sélection.",
                url: vin.url,
            };
            if (navigator.share) {
                var sharePromise = window.navigator.share(data);
            }
            else {//le navigateur n est pas compatible
                const text_modal_erreur = document.getElementById('text_erreur_modal');
                text_modal_erreur.innerHTML = 'Votre navigateur n\'est pas compatible avec cette fonctionnalité, préférez une utilisation mobile.';
                $("#modal-erreur").modal()
            }
        }
        else {
            const data = {
                title: vin.nom,
                text: " J'ai trouvé cette bouteille sur LBV Sélection :" + vin.nom + ". Elle n'est plus disponible mais je te recomande ce site.",
                url: "https://www.lbvselection.com/31-la-selection",
            };
            if (navigator.share) {
                var sharePromise = window.navigator.share(data);
            }
            else {//le navigateur n est pas compatible
                const text_modal_erreur = document.getElementById('text_erreur_modal');
                text_modal_erreur.innerHTML = 'Votre navigateur n\'est pas compatible avec cette fonctionnalité, préférez une utilisation mobile.';
                $("#modal-erreur").modal()
            }

        }

    }
}


//fonction de Damien modifiee
var ajoutterAuPannier = () => {
    const pannier = () => {
        hidePopUps();
        $("#modal_panier").modal()
        afficher_panier_lateral()
        document.querySelector(".cart-products-count").innerHTML = "(" + json_rep.cart.products_count + ")";
        // document.getElementById('rond_anim').classList.add('rectangle-panier-anim');
        if (json_rep.cart.products.length != 0) {
            document.querySelector(".blockcart").className = "blockcart cart-preview active";
            document.querySelector(".blockcart").innerHTML = '<div class="header">'
                + '<a href="../../cart?action=show">'
                + '<i class="material-icons shopping-cart">shopping_cart</i>'
                + '<span class="hidden-sm-down">Panier</span>'
                + '<span class="cart-products-count">(1)</span>'
                + '</a>'
                + '</div>';
        }
    }

    var formData = new FormData();
    formData.append("token", token);
    formData.append("id_product", idProduitAcheter);
    formData.append("id_customization", "0");
    formData.append("qty", nombreBouteilles);
    formData.append("add", "1");
    formData.append("action", "update");
    var req = new Requete(prestashop.urls.base_url + "cart");
    req.setData(formData);
    req.setCallBack(pannier);
    req.post();
}

const exportPdf = () => {
    let url;
    if (selectedProducts.length >= 1) {
        url = prestashop.urls.base_url + "module/exportpdf/getPdf?";
        url += "action=multiple";
        let compteur = 1;
        selectedProducts.map(id => {
            vinsAffiches.map(vin => {
                if (vin.id == id) {
                    url += "&id_product";
                    url += compteur;
                    url += "="
                    url += id;
                    compteur++;
                }
            });
        });
    }
    var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    var windowObjectReference = window.open(url, "monPdf", strWindowFeatures);
    selectedProducts = [];
}

//recupere le stock d une bouteille et renvoie le nombre de bouteille
var getStock = async (id_product) => {
    const url = prestashop.urls.base_url + "module/macave/api?stock=&id_product=" + id_product;
    var req = new Requete(url)
    const result = await req.get();
    return (result.stock);
}

//recupere les stocks de toutes les bouteilles du client
var getStocks = async (id_product) => {
    const url = prestashop.urls.base_url + "module/macave/api?stock=";
    var req = new Requete(url)
    const result = await req.get();
    stocks = result.stocks;
    filtrerCouleur();
}

//change le stock et l archivage es bouteille
var envoyerStock = async () => {
    const vin = trouverVinDansCave(idStockProduit);
    const url = prestashop.urls.base_url + "module/macave/api?";
    var formData = new FormData();
    formData.append("stock", "");
    formData.append("action", action);
    formData.append("number", stock);
    formData.append("id_product", idStockProduit);
    var req = new Requete(url);
    req.setData(formData);
    req.setCallBack(getStocks);
    const result = await req.post();
}
