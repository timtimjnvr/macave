/*---------------------------TRI DES VINS -------------------- */
const showTris = () => {
    if (document.getElementById("tri").style.display === "flex") {
        document.getElementById("tri").style.display = "none";
    }
    else {
        document.getElementById("tri").style.display = "flex";
    }
}

const hideTris = () => {
    document.getElementById("tri").style.display = "none";
}

const trier = (tri, sens) => {
    typeTri = tri;
    sensTri = sens;
    setTimeout(() => {
        filtrerCouleur();
        hideTris();
    }, 100);

}

//Fonctions de tri
function merge(left, right) {

    var tab = [], l = 0, r = 0;
    while (l < left.length && r < right.length) {
        if (sensTri === "croissant") {
            if (typeTri === "commandes") {
                if (left[l]["commandes"][0].date < right[l]["commandes"][0].date) {
                    tab.push(left[l++]);
                } else {
                    tab.push(right[r++]);
                }
            }
            else {
                if (parseFloat(left[l][typeTri]) < parseFloat(right[r][typeTri])) {
                    tab.push(left[l++]);
                } else {
                    tab.push(right[r++]);
                }
            }

        }
        else {
            if (typeTri === "commandes") {
                /*console.log("date 1: " + left[l]["commandes"][0].date);
                console.log("date 2: " + right[l]["commandes"][0].date);
                console.log(" date 1 > date 2 : ");
                console.log(left[l]["commandes"][0].date >= right[l]["commandes"][0].date)*/
                if (left[l]["commandes"][0].date > right[l]["commandes"][0].date) {
                    tab.push(left[l++]);
                } else {
                    tab.push(right[r++]);
                }
            }
            else if (typeTri === "stocks") {
                let stock_l;
                let stock_r;
                let archived_l;
                let archived_r;
                [stock_l, archived_l] = stockOf(left[l].id);
                [stock_r, archived_r] = stockOf(right[r].id);



                if (parseFloat(stock_l) > parseFloat(stock_r)) {
                    tab.push(left[l++]);
                } else {
                    tab.push(right[r++]);
                }

            }
            else {
                if (parseFloat(left[l][typeTri]) > parseFloat(right[r][typeTri])) {
                    tab.push(left[l++]);
                } else {
                    tab.push(right[r++]);
                }
            }

        }
    }
    return tab.concat(left.slice(l)).concat(right.slice(r));
}

function sort(tab) {
    if (tab.length < 2) {
        return tab;
    }
    var mid = Math.floor(tab.length / 2),
        right = tab.slice(mid),
        left = tab.slice(0, mid),
        p = merge(sort(left), sort(right));

    p.unshift(0, tab.length);
    tab.splice.apply(tab, p);
    return tab;
}