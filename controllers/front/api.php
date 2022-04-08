<?php
//ce fichier utilise la class controller pour connaitre les differentes
//variables globales de prestashop et les


class MacaveApiModuleFrontController extends ModuleFrontController
{
    /*entree de l api du module*/
    public function postProcess()
    {
        $HTTP_X_REQUESTED_WITH = isset($_SERVER['HTTP_X_REQUESTED_WITH']) ? $_SERVER['HTTP_X_REQUESTED_WITH'] : '';

        $name_module = "macave";

        $result = array();

        //utilisee pour renvoyer tous les vins : couleur : ''

        $now = DateTime::createFromFormat('U.u', microtime(true));
        $t1 = $now->format("s.u");
        $result['t1'] = $t1;

        if (isset($_REQUEST['couleur'])) {
            $couleur = $_REQUEST['couleur'];
            $mes_vins = $this->getMesVins($couleur);
            $result['mesvins'] = $mes_vins;
        }

        if (isset($_REQUEST['id'])) {
            $id = $this->getMonId();
            $result['id'] = $id;
        }

        if (isset($_REQUEST['nameString'])) {
            $nom = $this->getMonNom();
            $result['nameString'] = $nom;
        }

        if (isset($_REQUEST['notes'])) {
            $mes_notes = $this->getMesNotes();
            $result['mesnotes'] = $mes_notes;
        }

        if (isset($_REQUEST['stock'])) {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    if (isset($_REQUEST['id_product'])) {
                        $stock = $this->getStock($_REQUEST['id_product']);
                        if ($stock == false) {
                            $result['stock'] = 'nr';
                        } else {
                            $result['stock'] = $stock;
                        }
                    } else {
                        $stocks = $this->getMyStocks();
                        $result['stocks'] = $stocks;
                    }

                    break;
                case 'POST':
                    switch ($_REQUEST['action']) {
                        case 'updateStock':
                            $editionStock = $this->editStock($_REQUEST['id_product'], $_REQUEST['number']);
                            break;
                        case 'archive':
                            $archive = $this->archive($_REQUEST['id_product']);
                            break;
                    }
                    break;
            }
        }

        $now = DateTime::createFromFormat('U.u', microtime(true));
        $t2 = $now->format("s.u");
        $result['t2'] = $t2;

        echo json_encode($result);
    }

    public function getPack($id)
    {
        $requete_products =  'SELECT pk.id_product_pack,pk.id_product_item FROM ' . _DB_PREFIX_ . 'pack pk
        WHERE pk.id_product_pack = ' . $id;
        $products = Db::getInstance()->executeS($requete_products);
        return $products;
    }

    public function getMesVins($couleur)
    {
        $mesvins = array();

        $orders_needed_infos = array();

        $requete_url = 'SELECT  domain, physical_uri FROM ' . _DB_PREFIX_ . 'shop_url';
        $url_shop = Db::getInstance()->executeS($requete_url);

        $customer_orders = Order::getCustomerOrders($this->context->customer->id);

        foreach ($customer_orders as $customer_order) {
            //commente en local car pas possible de changer l etat en local
            if ($customer_order['id_order_state'] == 5) {
                $orders[$customer_order['id_order']] = array(
                    'id_order' => $customer_order['id_order'],
                    'order_date' => $customer_order['date_add'],
                    'id_order_state' => $customer_order['id_order_state'],
                    'order_state' => $customer_order['order_state'],
                );

                $order = new Order((int) $customer_order['id_order']);
                $order_products = $order->getProducts();

                foreach ($order_products as $op) {

                    $pack_items = $this->getPack($op['id_product']);

                    if ($pack_items != []) { //pack of bottles

                        foreach ($pack_items as $item) {

                            $order_product = array(
                                'id_product' => $item['id_product_item'],
                                'order_date' => $customer_order['date_add'],
                                'id_order_state' => $customer_order['id_order_state'],
                                'id_order' => $customer_order['id_order'],
                                'order_state' => $customer_order['order_state'],
                            );
                            $products[$item['id_product_item']][] = $order_product;
                        }
                    } else {
                        // Inforamtions concernant la commande pour chaque produit
                        $order_product = array(
                            'id_product' => $op['id_product'],
                            'product_name' => $op['product_name'],
                            'product_reference' => $op['product_reference'],
                            'image' => $op['image'],
                            'product_quantity' => $op['product_quantity'],
                            'product_quantity_in_stock' => $op['product_quantity_in_stock'], //stockage du stock client dans cette variable ?
                            'unit_price_paid' => $op['unit_price_tax_incl'],
                            'id_order' => $customer_order['id_order'],
                            'order_date' => $customer_order['date_add'],
                        );

                        $products[$op['id_product']][] = $order_product;
                    }
                }

                $mesvins = array();

                foreach ($products as $pid => $ps) {

                    $id_product =  $ps[0]['id_product'];

                    //informations concernant l'activité actuelle du produit
                    $requete_product = 'SELECT p.active,p.price FROM ' . _DB_PREFIX_ . 'product p WHERE p.id_product = "' . $id_product . '"';
                    $current_product = Db::getInstance()->executeS($requete_product);

                    // Informtions concernant le vin requete Damien module leguidelbv
                    $requete_cara = 'SELECT fl.name,fvl.value FROM ' . _DB_PREFIX_ . 'feature_product fp
                INNER JOIN ' . _DB_PREFIX_ . 'feature_lang fl ON fl.id_feature = fp.id_feature
                INNER JOIN ' . _DB_PREFIX_ . 'feature_value_lang fvl ON fvl.id_feature_value = fp.id_feature_value
                WHERE fp.id_product = "' . $id_product . '"
                and fl.id_lang = "1"
                GROUP BY fl.id_feature';
                    $bouteille_cara = Db::getInstance()->executeS($requete_cara);


                    //Description du vin
                    $requete_nom = 'SELECT pl.name,pl.description_short,pl.description,pl.link_rewrite,p.price,im.id_image,sa.quantity, sa.out_of_stock
                FROM ' . _DB_PREFIX_ . 'product_lang pl
                INNER JOIN ' . _DB_PREFIX_ . 'product p ON p.id_product = pl.id_product
                INNER JOIN ' . _DB_PREFIX_ . 'image_shop im ON im.id_product = pl.id_product
                INNER JOIN ' . _DB_PREFIX_ . 'stock_available sa ON sa.id_product = pl.id_product
                WHERE pl.id_product = "' . $id_product . '"
                AND pl.id_lang = "1"
                AND im.cover = "1"';

                    $vin_infos = Db::getInstance()->executeS($requete_nom);

                    $vin = array(
                        'id' => $ps[0]['id_product'],
                        'activity' => $ps[0]['activity'],
                        'nom' => $vin_infos[0]['name'],
                        'activity' => $current_product[0]['active'],
                        'price' => number_format(round($current_product[0]['price'] * (1 + 20 / 100), 2), 2, '.', ''),
                        'description' => $vin_infos[0]['description_short'],
                        'reference' => $ps[0]['product_reference'],
                        'image_url' => 'https://' . $url_shop[0]['domain'] . $url_shop[0]['physical_uri'] . $vin_infos[0]['id_image'] . '-lbv_produit/' . $vin_infos[0]['link_rewrite'] . '.jpg',
                        'product_url' => 'index.php?controller=product&id_product=' . ($ps[0]['id_product']),
                        'url' => 'https://' . $url_shop[0]['domain'] . $url_shop[0]['physical_uri'] . $ps[0]['id_product'] . '-' . $vin_infos[0]['link_rewrite'] . '.html',
                        'quantite_totale' => 0,
                        'unit_price_paid' => number_format($ps[0]['unit_price_paid'], 2, '.', ''),
                        'derniere_date' => '2017-01-01 12:00:00',
                        'commandes' => array(),
                    );

                    //formatage syntaxe caraceristiques vins (accents et majuscules)
                    foreach ($bouteille_cara as $caract) {
                        $carac_proper_syntax = strtolower(str_replace('é', 'e', str_replace(' ', '_', $caract['name'])));
                        $vin[$carac_proper_syntax] = $caract['value'];
                        if ($caract['name'] == 'Région') {
                            //used to filter by regions
                            $region_with_proper_syntax = strtolower(str_replace('é', 'e', str_replace(' ', '_', $caract['value'])));
                            $vin['region_sans_espace'] = $region_with_proper_syntax;
                        }
                    }

                    foreach ($ps as $p) {
                        $vin['quantite_totale'] += $p['product_quantity'];
                        if ($p['order_date'] > $vin['derniere_date'])
                            $vin['derniere_date'] = $p['order_date'];
                        $vin['commandes'][] = array(
                            'id_order' => $p['id_order'],
                            'url' => '/index.php?controller=order-detail&id_order=' . $p['id_order'],
                            'quantite' => $p['product_quantity'],
                            'date' => $p['order_date'],
                            'date_fr' => date_format(date_create($p['order_date']), 'd/m/Y'),
                        );
                    }

                    $vin['derniere_date_fr'] = date_format(date_create($vin['derniere_date']), 'd/m/Y');
                    //$mesvins[$vin['id']] = $vin;

                    if (array_key_exists('punchline', $vin) === false) {
                        $vin['punchline'] = "";
                    }
                    if (array_key_exists('cepages_principaux', $vin) === false) {
                        $vin['cepages_principaux'] = "non précisé";
                    }
                    if (array_key_exists('conso_1', $vin) === false) {
                        $vin['conso_1'] = 0;
                    }
                    if (array_key_exists('conso_2', $vin) === false) {
                        $vin['conso_2'] = 0;
                    }
                    if (array_key_exists('jury_pro', $vin) === false) {
                        $vin['jury_pro'] = 'nr';
                    }
                    if (array_key_exists('jury_amateur', $vin) === false) {
                        $vin['jury_amateur'] = 'nr';
                    }
                    if (array_key_exists('gamme', $vin) === false) {
                        $vin['gamme'] = 'nr';
                    }
                    if (array_key_exists('concentration', $vin) === false) {
                        $vin['concentration'] = 'nr';
                    }
                    if (array_key_exists('fraicheur', $vin) === false) {
                        $vin['fraicheur'] = 'nr';
                    }

                    if ($vin['couleur'] == $couleur || $couleur == '') {
                        //cette condition filtre les porduits qui ne sont pas des bouteilles
                        if (array_key_exists('couleur', $vin) === true) {
                            array_push($mesvins, $vin);
                        }
                    }
                }
                ksort($mesvins);
            }
        } // etat 5 : 'Commande livrée'

        return $mesvins;

        //traiter les autres etats de commande
    }

    public function getMonNom()
    {
        return $this->context->customer->firstname . ' ' . $this->context->customer->lastname;
    }

    public function getMonId()
    {
        return $this->context->customer->id;
    }

    public function getMesNotes()
    {
        $requete_notes =  'SELECT br.id,br.id_product,br.rating, br.text_review, br.date_add FROM ' . _DB_PREFIX_ . 'blockreviews br
        WHERE br.id_customer = "' . $this->context->customer->id . '" ORDER BY br.date_add DESC';
        $notes = Db::getInstance()->executeS($requete_notes);
        return $notes;
    }

    public function getStock($id_product)
    {
        $request_stock = 'SELECT mc.stock FROM ' . _DB_PREFIX_ . 'macave mc 
        WHERE mc.id_product = "' . $id_product . '" AND mc.id_customer = "' . $this->context->customer->id . '"';
        $stock = Db::getInstance()->executeS($request_stock);
        return ($stock[0]);
    }

    public function getMyStocks()
    {
        $request_stocks = 'SELECT mc.id_product,mc.stock,mc.archived FROM ' . _DB_PREFIX_ . 'macave mc 
        WHERE mc.id_customer = "' . $this->context->customer->id . '"';
        $stocks = Db::getInstance()->executeS($request_stocks);
        return ($stocks);
    }

    public function editStock($id_product, $number)
    {
        $stock = $this->getStock($_REQUEST['id_product']);

        if ($stock == false) { //le stock n est pas encore modifie 
            $edit_stock = 'INSERT INTO '  . _DB_PREFIX_ . 'macave VALUES (' . $_REQUEST['id_product'] . ',' . $this->context->customer->id . ',' . $_REQUEST['number'] . ',0)';
            $edition = Db::getInstance()->executeS($edit_stock);
            return $edition;
        } else {   //le stock est deja existant
            $edit_stock = 'UPDATE '  . _DB_PREFIX_ . 'macave mc SET mc.stock = ' . $number . ',mc.archived = 0 WHERE mc.id_product = "' . $id_product . '" AND mc.id_customer = "' . $this->context->customer->id . '"';
            $edition = Db::getInstance()->executeS($edit_stock);

            return $edition;
        }
    }

    public function archive($id_product)
    {
        $stock = $this->getStock($_REQUEST['id_product']);

        if ($stock == false) { //le stock n est pas encore modifie on cree la ligne
            $edit_archive = 'INSERT INTO '  . _DB_PREFIX_ . 'macave VALUES (' . $_REQUEST['id_product'] . ',' . $this->context->customer->id . ',0,1)';
            $archive = Db::getInstance()->executeS($edit_archive);
            return $archive;
        } else {   //le stock est deja existant on le met à zéro et on archive la bouteille
            $edit_archive = 'UPDATE '  . _DB_PREFIX_ . 'macave mc SET mc.stock = 0, mc.archived = 1 
            WHERE mc.id_product = "' . $id_product . '" AND mc.id_customer = "' . $this->context->customer->id . '"';
            $archive = Db::getInstance()->executeS($edit_archive);
            return $archive;
        }
    }
}
