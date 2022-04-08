
const popUpStock = async (id) => {
    const vin = trouverVinDansCave(id);
    idStockProduit = id;

    [stock, archivedStatus] = stockOf(id);
    if (stock == 0) {
        document.getElementById("archive-check").className = "checkbox";
        document.getElementById("archive-check-text").className = "text-check";

    }
    else {
        document.getElementById("archive-check").className = "checkbox gray-border";
        document.getElementById("archive-check-text").className = "text-check gray-label"
    }
    if (archivedStatus == 0) {
        document.getElementById("archive-check").innerHTML = "";
    }
    else {
        document.getElementById("archive-check").className = "checkbox-checked";
        document.getElementById("archive-check").innerHTML = '<img class="checked" src="../modules/macave/views/img/check.svg"/>'
    }

    document.getElementById("stock").innerHTML = stock;
    document.getElementById("pop-up-edit-stock").style.display = "flex";
    document.getElementById("pop-up-background").style.display = "flex";
}

const enregistrerVariablesStock = () => {

    hidePopUps();
    //enregistre le stock d une bouteille et la desarchive
    if (stock >= 0 && archivedStatus == 0) {
        action = "updateStock";
        envoyerStock();
    }
    //archive la bouteille et met le stock à 0
    if (archivedStatus == 1) {
        action = "archive";
        envoyerStock();
    }
}

const plusUneBouteilleStock = () => {
    const vin = trouverVinDansCave(idStockProduit);
    stock = Math.trunc(stock) + 1;
    archivedStatus = 0;

    document.getElementById("archive-check").className = "checkbox gray-border";
    document.getElementById("archive-check").innerHTML = "";
    document.getElementById("archive-check-text").className = "text-check gray-label";
    document.getElementById("stock").innerHTML = stock;
}

const moinsUneBouteilleStock = () => {
    if (stock >= 1) {
        stock = Math.trunc(stock) - 1;
        archivedStatus = 0;
    }
    if (stock == 0) {
        document.getElementById("archive-check").className = "checkbox";
        document.getElementById("archive-check-text").innerHTML = "Archiver cette bouteille";
        document.getElementById("archive-check-text").className = "text-check";
    }
    document.getElementById("stock").innerHTML = stock;
}

const modifierStatusArchive = () => {
    if (archivedStatus == 1) {
        archivedStatus = 0;
        document.getElementById("archive-check").className = "checkbox";
        document.getElementById("archive-check").innerHTML = ""
    }

    else if (archivedStatus == 0 && parseInt(stock) == 0) {
        archivedStatus = 1;
        document.getElementById("archive-check").className = "checkbox-checked";
        document.getElementById("archive-check").innerHTML = '<img class="checked" src="../modules/macave/views/img/check.svg"/>'
    }
    else {
        archivedStatus = 0;
        document.getElementById("archive-check").className = "checkbox gray-border";
        document.getElementById("archive-check").innerHTML = "";
    }
}

var stockOf = (id) => {
    const vin = trouverVinDansCave(id)

    let trouve = false;
    let result;

    if (stocks.length > 0) {
        stocks.map((item) => {
            if (parseInt(item.id_product) == parseInt(id)) {
                trouve = true;
                result = [parseInt(item.stock), parseInt(item.archived)];
            }
        });
        if (trouve == true) {
            return (result);
        }
        else {
            return ([parseInt(vin.quantite_totale), 0]);
        }
    } else {
        return ([parseInt(vin.quantite_totale), 0]);
    }
}