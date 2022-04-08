<!doctype html>
<html lang="FR">
<head>
   {block name='head'}
   {include file='_partials/head.tpl'}
   {/block}
   
   <script rel="preload" src="../../modules/macave/views/js/dialogueApi.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/display.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/filtrer.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/trier.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/stock.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/loader.js"></script>
   <script rel="preload" src="../../modules/macave/views/js/vars.js"></script>

   <link rel="stylesheet" type="text/css" href="../../modules/macave/views/css/main.css">
   <link rel="stylesheet" type="text/css" href="../../modules/macave/views/css/loader.css">

   <meta meta name="viewport" content="width=device-width, user-scalable=no" />
</head>

<body>
<main>
   <header id="header">
      
      {block name='header'}
         {include file='_partials/header.tpl'}
      {/block}

      <div class="header-filters">
         <div class="line-header">
            <h1>Mes Bouteilles</h1>
         </div>
         <div class="first-line-header">
         <div class="input-search">
               <input id="search" class="input-inside" type="text" placeholder="Chercher ma bouteille"/>
               <img class="loupe-input"  src="../../modules/macave/views/img/loupe.svg" />
         </div>
         </div>
         <ul id="search-propositions" class="propositions">
         </ul>
         <div id="active-filters" class="active-filters"></div>
         <div class="second-line-header">
            <div class="left-button">
               <div class="left-button-inside" onclick="showTris()"><div>TRIER</div><img class="filters-button" src="../../modules/macave/views/img/trier.svg" /></div>
            </div>
            <div class="left-button">
               <div class="left-button-inside"><div onclick="showFilters()" >FILTRER<img class="filters-button" src="../../modules/macave/views/img/lister.svg" /></div></div>
            </div>
         </div>      
         <ul id="tri" class="tri">
            <label class="radio-check">
               <input type="radio" onclick='trier("conso_2","croissant")' id="date-crois" name="tri" value="date-crois">
               <div style="display: flex; align-items : center; margin-left: 20px; width: 350px"><div for="date-crois" style="margin-left: 20px">Les plus à boire</div></div>
            </label>
            <label class="radio-check">
               <input type="radio" onclick='trier("price","croissant")' id="prix-cher" name="tri" value="prix-cher">
               <div style="display: flex; align-items : center; margin-left: 20px; width: 350px"><div for="prix-cher" style="margin-left: 20px">Prix d'achat croissant</div></div>
            </label>
            <label class="radio-check">
               <input type="radio" onclick='trier("price","décroissant")' id="prix-peu-cher" name="tri" value="prix-peu-cher">
               <div style="display: flex; align-items : start; margin-left: 20px; width: 350px"><div for="prix-peu-cher" style="margin-left: 20px">Prix d'achat décroissant</div></div>
            </label>
            <label class="radio-check">
               <input type="radio" onclick='trier("commandes","décroissant")' id="dates" name="tri" value="dates">
               <div style="display: flex; align-items : start; margin-left: 20px; width: 350px"><div for="dates" style="margin-left: 20px">Commandes les plus récentes</div></div>
            </label>
            <label class="radio-check">
               <input type="radio" onclick='trier("stocks","décroissant")' id="stocks" name="tri" value="stocks">
               <div style="display: flex; align-items : start; margin-left: 20px; width: 350px"><div for="dates" style="margin-left: 20px">Nombre de bouteilles en stock</div></div>
            </label>
            <img onclick="hideTris()" style="width: 20px" src="../../modules/macave/views/img/fleche-vers-le-haut-red.svg" />
         </ul>
      </div>
   </header>

   <div class="background noselect">
   
      <!--Container où seront affichés les vins-->
      <div id="my-wines" id="my-wines" class="my-wines">
      </div>

      <!--Differents pop ups du module-->
      <div id="pop-up-background" onclick="hidePopUps()" class="pop-up-back">
      </div>

      <div id="pop-up-com" class="pop-up-center">
      <div class="pop-up-in">
         <img style="position: absolute; top:15px;right:15px;width: 20px" src="../../modules/macave/views/img/close.svg" onclick="hidePopUps()"/>
            <div class="stars-container">
               <img id="etoile-1" onclick="rate(1)"  class="star-com" src="../../modules/macave/views/img/etoile.svg"/>
               <img id="etoile-2" onclick="rate(2)"  class="star-com" src="../../modules/macave/views/img/etoile.svg"/>
               <img id="etoile-3" onclick="rate(3)"  class="star-com" src="../../modules/macave/views/img/etoile.svg"/>
               <img id="etoile-4" onclick="rate(4)"  class="star-com" src="../../modules/macave/views/img/etoile.svg"/>
               <img id="etoile-5" onclick="rate(5)"  class="star-com" src="../../modules/macave/views/img/etoile.svg"/>
            </div>
         <textarea id="commentaire-client" class="input-pop-up" placeholder="Votre commentaire" maxlength="250"></textarea>
            <div class="btn btn-tim" onclick="soumettreNote()">Envoyer</div>
         </div>
      </div>
      </div>

      <div id="pop-up-combien-bouteilles"class="pop-up-center">
      <div class="pop-up-in">
         <img style="position: absolute; top:15px;right:15px;width: 20px" src="../../modules/macave/views/img/close.svg" onclick="hidePopUps()"/>
         <p id="prix"></p>
         <img class="plus" src="../../modules/macave/views/img/plus.svg" onclick="plusUneBouteille()"/>
         <div id="nombre" oninput="actualiserNombreBouteilles()" style="display: flex; justify-content: center; align-items: center;font-size:2rem; min-height: 2rem;min-width:2rem; outline:none; border: 2px solid #cc2669; border-radius:0.5rem" contenteditable>1</div>
         <img class="plus" src="../../modules/macave/views/img/moins.svg"  style=""onclick="moinsUneBouteille()"/>
            <div onclick="acheter()" class="btn btn-tim" >Ajouter au panier</div>
      </div>
      </div>

      <div id="pop-up-edit-stock"class="pop-up-center">
      <div style="padding: 20px" class="pop-up-in">
         <img style="position: absolute; top:15px;right:15px;width: 20px" src="../../modules/macave/views/img/close.svg" onclick="hidePopUps()"/>
         <h3>Dans ma cave</h3>
         <p style="width: 85%; text-align: center" class="gray-text">Vous pouvez archiver une bouteille dans votre cave si son stock est nul.</p>
         <img class="plus" src="../../modules/macave/views/img/plus.svg" onclick="plusUneBouteilleStock()"/>
         <div id="stock" style="display: flex; justify-content: center; align-items: center;font-size:2rem; min-height: 2rem;min-width:2rem; outline:none; border: 2px solid #cc2669; border-radius:0.5rem"></div>
         <img class="plus" src="../../modules/macave/views/img/moins.svg"  style=""onclick="moinsUneBouteilleStock()"/>
         <div id="archive-container" class="archive-container" onclick="modifierStatusArchive()">
            <div class="checkbox gray-border" id="archive-check" name="archive"></div>
            <div id="archive-check-text" class="text-check gray-label">Archiver cette bouteille</div>
         </div>
         <div onclick="enregistrerVariablesStock()" class="btn btn-tim" >Enregistrer</div>
      </div>
      </div>

      <div id="pop-up-photo" class="pop-up-center">
      <div id="pop-up-photo-inner" style="height: min(70vw, 400px)" class="pop-up-in">
      </div>
      </div>
      </div>

      <div id="pop-up-loader" class="loader-center">
         <div id="bottle" class="bottle">
            <div class="bottle-bout"></div>
            <div class="bottle-top"></div>
            <div id="bottle-body" class="bottle-body">
                <div class="etiquette">
                    <div class="logo">LBV</div>
                    <div class="selection">Sélection</div>
                </div>
            </div>
        </div> 
      </div>
      </div>




      <div class="export-container">
         <img id="cancel-export" class="cancel-export" onclick="annulerExport()" class="wine-color-button" src="../../modules/macave/views/img/annuler-export.svg"/>
         <div id="export" class="export" onclick="selectWines()">
            Créer une fiche de dégustation
         </div>
         <div id="nombre-vins" class="nombre-vins">0</div>
      </div>
   </div>


         
         <!--Modal filtres-->
         <div class="modal right fade" id="modal_filtres">
            <div class="modal-dialog modal-compte-client">
               <div>
                  <div class="card-block" style="padding-bottom:0px">
                     <button type="button" class="close close-panier fermer_panier"
                        data-dismiss="modal">&times;</button>
                     <h1 class="h1">Filtres</h1>
                     <button onclick="filtrerCouleur()" class="btn btn-tim" data-dismiss="modal">Appliquer les filtres</button>
                     <hr style="">
                  </div>
                  <div>
                     <ul id="archive">
                        <li>
                           <div class="filter-checkbox" onclick='check("archivee","archive")'>
                              <div id="archivee" class="checkbox"></div>
                              <div class="text-check">Voir mes bouteilles archivées</div>
                           </div>
                        </li>
                     </ul>
                     <h1 style="margin-left: 20px">Couleurs </h1>
                     <ul id="couleur">
                     </ul>
                     <h1 style="margin-left: 20px">Régions</h1>
                     <ul id="region">
                     </ul>
                     <h1 style="margin-left: 20px">Période de garde</h1>
                     <ul id="garde">
                        <li>
                        <label class="radio-check">
                        <input type="radio" onclick='check("a-boire","garde")' id="a-boire" name="garde-filter" value="a-boire">
                        <div style="display: flex; align-items : center; margin-left: 20px"><div for="a-boire" class="text-radio">À boire</div></div>
                        </label>
                        </li>
                        <li>
                        <label class="radio-check">
                        <input type="radio" onclick='check("a-boire-ou-a-garder","garde")' id="a-boire-ou-a-garder" name="garde-filter" value="a-boire-ou-a-garder">
                        <div style="display: flex; align-items : center; margin-left: 20px"><div for="a-boire-ou-a-garder" class="text-radio">À boire ou à garder</div></div>
                        </label>
                        </li>
                        <li>
                        <label class="radio-check">
                        <input type="radio" onclick='check("a-garder","garde")' id="a-garder" name="garde-filter" value="a-garder">
                        <div style="display: flex; align-items : center; margin-left: 20px"><div for="a-garder" class="text-radio">À garder</div></div>
                        </label>
                        </li>
                     </ul>
                     <h1 style="margin-left: 20px">Prix</h1>
                     <div class="prix-container">
                        <div class="wrapper-macave">
                           <div class=values>
                              <span id="range1">0€</span>
                              <span>&dash;</span>
                              <span id="range2">100€</span>
                           </div>
                           <div class="container-slider">
                           <div class="slider-tracker"></div>
                           <input id="slider-1" type="range" min="0" max="100" step="1" value="0" oninput="slideOne()">
                           <input id="slider-2" type="range" min="0" max="100" step="1" value="100" oninput="slideTwo()">
                        </div>
                     </div>
                     </div>
                     <h1 style="margin-left: 20px">Commandes</h1>
                     <ul id="commande">
                     </ul>
                  </div>
               </div>
            </div>
         </div> 

         <!-- Modal erreur -->
         <div class="modal fade" id="modal-erreur">
            <div class="modal-dialog">
               <div class="modal-content modal-description">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h1 id="titre_erreur_modal">Désolé,</h1>
                  <p id="text_erreur_modal"></p>
               </div>
            </div>
         </div>
   <footer id="footer" style="padding-top: 250px">
         {block name="footer"}
         {include file="_partials/footer.tpl"}
         {/block}
   </footer>
   </main>
</body>
   {block name='javascript_bottom'}
   {include file="_partials/javascript.tpl" javascript=$javascript.bottom}
   {/block}

<script src="../../modules/macave/views/js/scroll.js" defer></script>
<script>
   initialiserLesVariables();
   var token = "{$static_token}";
   ecouterRecherche();
</script>
</html>
